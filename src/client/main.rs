#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
  )]

pub mod scheduler;
pub mod task;
pub mod mappings;
pub mod local_fs;
pub mod settings;
pub mod pref_variants;

use lazy_static::lazy_static;
use app::window;
use serde_json;
use serde;
use mappings::api_response::Tasks;
use mappings::settings::Settings;
use mappings::pref_variants::PrefVariants;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

const TASKS_PATH: &str = "\\ZoomAttender";
const DATA_FOLDER: &str = "zoomattender_data";
const SETTINGS_FILE: &str = "settings.json";
const PREFS_FILE: &str = "prefs.json";

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

    if !ABSOLUTE_DATA_FOLDER.exists() {
        std::fs::create_dir(ABSOLUTE_DATA_FOLDER.to_str().unwrap())?;
    }

    if !ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE).exists() {
        local_fs::default_json(SETTINGS_FILE, Settings::default())?;
    }

    if !ABSOLUTE_DATA_FOLDER.join(PREFS_FILE).exists() {
        local_fs::default_json(PREFS_FILE, PrefVariants::default())?;
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scheduler::open_scheduler])
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