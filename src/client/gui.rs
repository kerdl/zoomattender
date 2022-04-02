use crate::{
    window,
    ABSOLUTE_DATA_FOLDER,
    SETTINGS_FILE,
    PREFS_FILE,
};
use windows::{
    Win32::System::{
        Threading::{
            CREATE_NO_WINDOW
        },
    }
};

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
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
            .to_str()
            .unwrap(),
        settings
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
pub fn open_scheduler() {
    let _ = window::create_process(
        "cmd /c taskschd", 
        CREATE_NO_WINDOW
    ); 
}