#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
  )]

pub mod gui;
pub mod scheduler;
pub mod tasks;
pub mod mappings;
pub mod local_fs;
pub mod pref_variants;
pub mod local_tasks;
pub mod dt;

use reqwest;
use clap::Parser;
use lazy_static::lazy_static;
use winrt_notification::{Duration, Sound, Toast, Scenario};
use app::{window, args};
use mappings::settings::Settings;
use mappings::pref_variants::PrefVariants;
use mappings::windnames::Windnames;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

const AUTOMATIC_UPD_TASK_NAME: &str = "_Automatic_Update";
const TASKS_PATH: &str = "\\ZoomAttender";
const WATCH_EXE: &str = "watch.exe";
const DATA_FOLDER: &str = "zoomattender_data";
const SETTINGS_FILE: &str = "settings.json";
const PREFS_FILE: &str = "prefs.json";
const WINDNAMES_FILE: &str = "windnames.json";

lazy_static! {
    static ref ABSOLUTE_DATA_FOLDER: std::path::PathBuf = {
        let curr_path = std::env::current_exe()
            .expect("Failed to get current executable path");
        let mut path = std::path::PathBuf::from(
            curr_path.parent().unwrap()
        );
        path.push(DATA_FOLDER);
        path
    };
}


fn main() -> Result<()> {

    let args = args::ClientArgs::parse();

    let scheduler = scheduler::Scheduler::new()?;
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

    if args.update {
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

        let tasks_str = reqwest::blocking::get(
            settings.tasks.api_url
        )?.text()?;

        let created = tasks::update_tasks(
            tasks_str, 
            settings.tasks.group.unwrap()
        );

        println!("{:?}", created);

        Toast::new(Toast::POWERSHELL_APP_ID)
            .title("Некоторые Zoom задачи не были установлены")
            .text1("Возможно, в Zoom Attender будут подробности...")
            .sound(Some(Sound::Default))
            .duration(Duration::Long)
            .scenario(Scenario::Reminder)
            .show()
            .expect("unable to toast");

        return Ok(())
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            gui::open_scheduler,
            gui::auto_upd_turned_on,
            gui::set_automatic_upd,
            gui::get_tasks_from_scheduler,
            gui::delete_all_tasks,
            gui::set_task_state,
            gui::update_tasks,
            gui::edit_task,
            gui::load_settings,
            gui::save_settings,
            gui::reset_settings,
            gui::load_prefs,
            gui::replace_teacher_pref,
            gui::save_prefs,
            gui::load_windnames
        ])
        .run(tauri::generate_context!())
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