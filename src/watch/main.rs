//#![windows_subsystem = "windows"]

pub mod watchdog;
pub mod fmtstring;
pub mod zoom;
pub mod gui;

use app::{
    mappings::{
        settings::Settings,
        windnames::Windnames,
    },
    window, 
    args, 
    consts::*
};
use lazy_static::lazy_static;
use serde_json;
use clap::Parser;
use watchdog::Watchdog;
use windows::Win32::System::Threading::CREATE_NO_WINDOW;
use zoom::Zoom;
use chrono::{DateTime, Duration};
use ::core::time;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

lazy_static! {
    pub static ref SETTINGS: Settings = {
        let settings_str = std::fs::read_to_string(
            ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
        ).unwrap().to_string();
        serde_json::from_str(&settings_str).unwrap()
    };
}


fn main() -> Result<()> {
    let args = args::WatchArgs::parse();
    
    let id = &args.id; //"9608553019"; 
    let pwd = &args.pwd.unwrap(); //"Y3NERFVlYVc3dkdUM2pxc21TanYxdz09";

    let windnames_str = std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(WINDNAMES_FILE)
    )?.to_string();
    let windnames: Windnames = serde_json::from_str(&windnames_str)?;

    if SETTINGS.conflicts.kill_zoom {
        window::create_process(
            "cmd /c taskkill /IM \"Zoom.exe\" /F", 
            CREATE_NO_WINDOW
        )?;
        println!("Zoom killed, sleeping 2 sec...");
        std::thread::sleep(time::Duration::from_secs(2));
    }

    let zoom = Zoom::new(SETTINGS.zoom.zoom_path.clone());

    if SETTINGS.rejoin.do_rejoin {
        let windows_to_watch: Vec<String>;
        
        match SETTINGS.rejoin.zoom_language.clone().unwrap().as_str() {
            "ru" => windows_to_watch = windnames.ru.names.clone(),
            "en" => windows_to_watch = windnames.en.names.clone(),
            _ => panic!("Unsupported Zoom language")
        }
        println!("Watching windows: {:?}", windows_to_watch);

        let wd = Watchdog::new(
            windows_to_watch, 3, 1, 
            SETTINGS.rejoin.max_no_windows.into()
        )?;

        let end = DateTime::parse_from_rfc3339(&args.end)?;

        let do_not_rejoin_time = end - Duration::minutes(SETTINGS.rejoin.do_not_rejoin_end.into());

        println!("Won't rejoin after: {:?}", do_not_rejoin_time);

        loop {
            zoom.run_from_id_pwd(id, pwd)?;
            println!("Zoom runned, sleeping {} sec...", SETTINGS.rejoin.do_not_watch);
            std::thread::sleep(time::Duration::from_secs(
                SETTINGS.rejoin.do_not_watch.into())
            );
            wd.watch();
            let now = chrono::offset::Local::now();
            if now > do_not_rejoin_time {
                println!("Not rejoining");
                return Ok(());
            }
            tauri::Builder::default()
                .invoke_handler(tauri::generate_handler![
                    gui::session,
                    gui::timeout
                ])
                .build(tauri::generate_context!(".\\tauri.watch.conf.json"))
                .expect("error while running tauri application")
                .run(|app_handle, e| {println!("{:?}", e);});
                

            println!("BYE!!!");
        }
    }
    else {
        zoom.run_from_id_pwd(id, pwd)?;
    }

    Ok(())
}

