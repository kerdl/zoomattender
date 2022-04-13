#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
  )]

pub mod gui;
pub mod tasks;
pub mod local_fs;
pub mod dt;

use reqwest;
use clap::Parser;
use winrt_notification::{Duration, Sound, Toast, Scenario};
use app::{
    scheduler::Scheduler,
    mappings::{
        settings::Settings,
        pref_variants::PrefVariants,
        windnames::Windnames,
        tasks::Groups
    },
    window, 
    args, 
    consts::*
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


fn main() -> Result<()> {

    let args = args::ClientArgs::parse();

    let scheduler = Scheduler::new()?;
    if !scheduler.folder_exists(TASKS_PATH) {
        scheduler.make_folder(TASKS_PATH)?;
    }
    
    println!("{:?}", scheduler.list_tasks(TASKS_PATH)?);

    let mut settings_just_created = false;

    if !ABSOLUTE_DATA_FOLDER.exists() {
        std::fs::create_dir(ABSOLUTE_DATA_FOLDER.to_str().unwrap())?;
    }

    if !ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE).exists() {
        settings_just_created = true;
        local_fs::default_json(SETTINGS_FILE, Settings::default())?;
    }

    if !ABSOLUTE_DATA_FOLDER.join(PREFS_FILE).exists() {
        local_fs::default_json(PREFS_FILE, PrefVariants::default())?;
    }

    if !ABSOLUTE_DATA_FOLDER.join(WINDNAMES_FILE).exists() {
        local_fs::default_json(WINDNAMES_FILE, Windnames::default())?;
    }

    if !ABSOLUTE_DATA_FOLDER.join(LAST_TASKS_RESPONSE).exists() {
        local_fs::default_json(LAST_TASKS_RESPONSE, Groups::default())?;
    }

    if args.update {
        println!("updating tasks");

        if settings_just_created {
            panic!("App wasn't initialized wtf?");
        }

        let settings_str = std::fs::read_to_string(
            ABSOLUTE_DATA_FOLDER
                .join(SETTINGS_FILE)
        ).unwrap();

        let settings: Settings = serde_json::from_str(
            &settings_str
        ).unwrap();

        let tasks_ver = tasks::fetch_tasks(&settings.tasks.api_url)?;

        if tasks_ver.old == tasks_ver.new {
            println!("tasks not changed");
            return Ok(());
        };

        let old_group = tasks_ver.old.groups.iter().find(
            |g| &g.group == settings.tasks.group.as_ref().unwrap()
        );
        let new_group = tasks_ver.new.groups.iter().find(
            |g| &g.group == settings.tasks.group.as_ref().unwrap()
        );

        if new_group.is_none() {
            println!("group not found in new tasks");
            return Ok(());
        };

        if old_group.is_some() && old_group.unwrap() == new_group.unwrap() {
            println!("no new tasks");
            return Ok(());
        };

        let created = tasks::update_tasks(
            serde_json::to_string_pretty(&tasks_ver.new)?, 
            settings.tasks.group.unwrap()
        );

        println!("created tasks {:?}", created);

        if created.is_ok() && created.as_ref().unwrap().is_some() {
            let mut toast_sent = false;

            for task in created.unwrap().unwrap().tasks {
                println!("{:?}", task);
                if task.id == "0" && settings.notifications.questionable_zoom_variant {
                    Toast::new(Toast::POWERSHELL_APP_ID)
                        .title("Попалось несколько вариантов данных Zoom")
                        .text1("Проверь Zoom Attender и установи вариант")
                        .sound(Some(Sound::Default))
                        .duration(Duration::Long)
                        .scenario(Scenario::Reminder)
                        .show()
                        .expect("unable to toast");
                    toast_sent = true;
                }
            }

            if !toast_sent && settings.notifications.task_upd_notify {
                Toast::new(Toast::POWERSHELL_APP_ID)
                    .title("Обновление задач Zoom Attender")
                    .text1("Zoom задачи обновлены")
                    .sound(Some(Sound::Default))
                    .duration(Duration::Long)
                    .scenario(Scenario::Reminder)
                    .show()
                    .expect("unable to toast");
            }
        }



        return Ok(())
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            gui::session,
            gui::open_scheduler,
            gui::open_link,
            gui::auto_upd_turned_on,
            gui::set_automatic_upd,
            gui::get_tasks_from_scheduler,
            gui::fetch_tasks,
            gui::delete_all_tasks,
            gui::set_task_state,
            gui::update_tasks,
            gui::edit_task,
            gui::load_settings,
            gui::save_settings,
            gui::reset_settings,
            gui::load_prefs,
            gui::reset_prefs,
            gui::replace_teacher_pref,
            gui::save_prefs,
            gui::load_windnames
        ])
        .run(tauri::generate_context!(".\\tauri.client.conf.json"))
        .expect("error while running tauri application");
    Ok(())

    //println!("this is client sir");
    //let resp = std::fs::read_to_string("resp.json").unwrap();
    //let des: Tasks = serde_json::from_str(&resp).unwrap();
    //println!("{:?}", des);
    //des.make()?;
    //Ok(())
    //let _ = std::process::Command::new("cmd.exe")
    //            .arg("/c")
    //            .arg("pause")
    //            .status();
}