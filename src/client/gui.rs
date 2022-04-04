use crate::{
    window,
    ABSOLUTE_DATA_FOLDER,
    SETTINGS_FILE,
    PREFS_FILE,
    WINDNAMES_FILE
};
use windows::{
    Win32::System::{
        Threading::{
            CREATE_NO_WINDOW
        },
    }
};
use serde_json;
use crate::mappings::settings::Settings;

//type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


#[tauri::command]
pub fn load_settings() -> String {
    std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
            .to_str()
            .unwrap()
    ).unwrap()
}

#[tauri::command]
pub fn save_settings(settings: String) {
    let des: Settings = serde_json::from_str(&settings).unwrap();
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
            .to_str()
            .unwrap(),
        &serde_json::to_string_pretty(&des).unwrap()
    );
}

#[tauri::command]
pub fn reset_settings() {
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
            .to_str()
            .unwrap(),
        &serde_json::to_string_pretty(&Settings::default()).unwrap()
    );
}

#[tauri::command]
pub fn load_prefs() -> String {
    std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(PREFS_FILE)
            .to_str()
            .unwrap()
    ).unwrap()
}

#[tauri::command]
pub fn save_prefs(prefs: String) {
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(PREFS_FILE)
            .to_str()
            .unwrap(),
        prefs
    );
}

#[tauri::command]
pub fn load_windnames() -> String {
    std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(WINDNAMES_FILE)
            .to_str()
            .unwrap()
    ).unwrap()
}

#[tauri::command]
pub fn open_scheduler() {
    let _ = window::create_process(
        "cmd /c taskschd", 
        CREATE_NO_WINDOW
    ); 
}