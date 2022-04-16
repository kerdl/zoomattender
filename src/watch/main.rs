#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
  )]

pub mod watchdog;
pub mod fmtstring;
pub mod zoom;
pub mod gui;

use app::{
    mappings::{
        settings::Settings,
        windnames::Windnames,
        events::SetWatchOnlyEvent
    },
    window, 
    args, 
    consts::*
};
use lazy_static::lazy_static;
use serde_json;
use clap::Parser;
use tauri::{RunEvent, WindowEvent, Manager};
use watchdog::Watchdog;
use windows::Win32::System::Threading::{CREATE_NO_WINDOW, INHERIT_PARENT_AFFINITY};
use zoom::Zoom;
use chrono::{DateTime, Duration};
use ::core::time;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

lazy_static! {
    pub static ref ARGS: args::WatchArgs = args::WatchArgs::parse();

    pub static ref SETTINGS: Settings = {
        let settings_str = std::fs::read_to_string(
            ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
        ).unwrap().to_string();
        serde_json::from_str(&settings_str).unwrap()
    };

    pub static ref WATCHONLY: std::sync::Mutex<bool> = std::sync::Mutex::new(false);
}

fn main() -> Result<()> {
    println!("{} {} {:?}", ARGS.name, ARGS.id, ARGS.pwd);

    // получаем окна, за которымы будем смотреть
    let windnames_str = std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(WINDNAMES_FILE)
    )?.to_string();
    let windnames: Windnames = serde_json::from_str(&windnames_str)?;

    // если поставлено убивать зум
    if !ARGS.watchonly && SETTINGS.conflicts.kill_zoom {
        // убить зум
        window::kill_all(ZOOM_EXE_NAME);
        println!("zoom killed, sleeping 2 sec...");
        std::thread::sleep(time::Duration::from_secs(2));
    }

    // инициализируем штуку для запуска зума
    let zoom = Zoom::new(SETTINGS.zoom.zoom_path.clone());

    // если не перезаход после изменения настроек
    if !ARGS.watchonly {
        // если есть пароль от конфы
        if ARGS.pwd.is_some() {
            // запустить зум с паролем
            zoom.run_from_id_pwd(&ARGS.id, Some(ARGS.pwd.as_ref().unwrap()))?;
        }
        else {
            // запустить зум без пароля
            zoom.run_from_id_pwd(&ARGS.id, None)?;
        }
    }

    // если надо перезаходить
    if SETTINGS.rejoin.do_rejoin {
        let windows_to_watch: Vec<String>;
        
        // получаем язык зума, который стоит в настройках
        match SETTINGS.rejoin.zoom_language.clone().unwrap().as_str() {
            "ru" => windows_to_watch = windnames.ru.names.clone(),
            "en" => windows_to_watch = windnames.en.names.clone(),
            _ => panic!("unsupported zoom language")
        }
        println!("watching windows: {:?}", windows_to_watch);

        // инициализируем штуку для присмотра за окнами
        let wd = Watchdog::new(
            windows_to_watch, 3, 1, 
            SETTINGS.rejoin.max_no_windows.into()
        )?;

        // получаем время окончания задачи
        let end = DateTime::parse_from_rfc3339(&ARGS.end)?;
        
        // получаем время, после которого не надо перезаходить
        let do_not_rejoin_time = end - Duration::minutes(
            SETTINGS.rejoin.do_not_rejoin_end.into()
        );

        println!("won't rejoin after: {:?}", do_not_rejoin_time);
        
        // если не перезаход после изменения настроек
        if !ARGS.watchonly {
            // даём фору пока зум запустится
            std::thread::sleep(time::Duration::from_secs(
                SETTINGS.rejoin.do_not_watch.into())
            );
        }
        
        // смотрим за зумом каждую секунду
        wd.watch();

        // получаем текущее время
        let now = chrono::offset::Local::now();

        // если время, после которого не надо перезаходить больше текущего
        if now > do_not_rejoin_time {
            println!("not rejoining because exceeded time");
            return Ok(());
        }

        // если время не вышло и зум пропал, 
        // открываем новое окно с подтверждением перезахода
        tauri::Builder::default()
            .invoke_handler(tauri::generate_handler![
                gui::session,
                gui::run_client,
                gui::timeout,
                gui::task_name,
                gui::task_start,
                gui::task_end,
                gui::exit_main
            ])
            .setup(|app| {
                app.listen_global("watchonly", |event| {
                    let evt: SetWatchOnlyEvent = serde_json::from_str(
                        event.payload().unwrap()
                    ).unwrap();
                    println!("watchonly event: {:?}", evt);
                    let mut w = WATCHONLY.lock().unwrap();
                    *w = evt.state;
                    println!("watchonly: {:?}", *w);
                });
                Ok(())
            })
            .build(tauri::generate_context!(".\\tauri.watch.conf.json"))
            .expect("error while running tauri application")
            .run(|handle, e| {
                match e {
                    // если окно было закрыто
                    RunEvent::WindowEvent {
                        label: _, 
                        event: WindowEvent::CloseRequested {api: _, ..}, 
                        ..
                    } => {
                        println!("exiting process");
                        handle.exit(0)
                    },
                    // если было нажато перезайти или истекло время ожидания
                    RunEvent::ExitRequested {api: _, ..} => {
                        println!("rejoining in separate process");

                        let watchonly = {
                            let w = WATCHONLY.lock().unwrap();
                            *w
                        };

                        // копируем аргументы, которые были у этого watch.exe
                        let self_args = args::WatchArgs::new(
                            ARGS.name.clone(),
                            ARGS.start.clone(),
                            ARGS.end.clone(),
                            ARGS.id.clone(),
                            ARGS.pwd.clone(),
                            watchonly
                        );
                        let self_args_str = self_args.stringify();

                        // путь до watch.exe + аргументы
                        let exe_and_args = format!("{} {}", 
                                ABSOLUTE_FOLDER.join(WATCH_EXE).to_str().unwrap(), 
                                self_args_str
                        );

                        println!("{}", exe_and_args);

                        // создаём новый процесс watch.exe
                        let p = window::create_process(
                            &exe_and_args, 
                            INHERIT_PARENT_AFFINITY
                        );
                        if p.is_err() {
                            println!("{}", p.unwrap_err());
                        }

                        // выходим из текущего процесса
                        handle.exit(0);
                    },
                    _ => {}
                }
            });
    }
    else {
        println!("not rejoining because of settings");
    }
    Ok(())
}

// говнокод бляя!!! можно было засунуть в луп, 
// а не создавать новый процесс, но я тупой пиздец 
// и не знаю как, таури билдер не возвращает 
