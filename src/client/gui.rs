use crate::{
    window,
    ABSOLUTE_DATA_FOLDER,
    SETTINGS_FILE,
    PREFS_FILE,
    WINDNAMES_FILE, 
    TASKS_PATH,
    WATCH_EXE,
    AUTOMATIC_UPD_TASK_NAME,
    scheduler::Scheduler,
    dt,
    mappings::tasks::Groups,
    mappings::pref_variants::PrefVariants,
    mappings::settings::Settings,
    tasks
};
use windows::{
    Win32::System::{
        Threading::{
            CREATE_NO_WINDOW
        },
    }
};
use serde_json;
use chrono::Utc;

//type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


#[tauri::command]
pub fn update_tasks(tasks: String, group: String) -> Result<String, String> {
    let result = tasks::update_tasks(tasks, group);
    match result {
        Ok(Some(tasks)) => return Ok(
            serde_json::to_string_pretty(&tasks).unwrap()
        ),
        Ok(None) => Ok("".to_string()),
        Err(e) => Err(format!("{}", e))
    }
}

pub fn auto_upd_exists() -> bool {
    let sc = Scheduler::new().unwrap();
    sc.task_exists(TASKS_PATH, AUTOMATIC_UPD_TASK_NAME).unwrap()
}

#[tauri::command]
pub fn auto_upd_turned_on() -> bool {
    let sc = Scheduler::new().unwrap();
    let task = sc.get_task(TASKS_PATH, AUTOMATIC_UPD_TASK_NAME).unwrap();
    unsafe {task.Enabled().unwrap() != 0}
}

#[tauri::command]
pub fn set_automatic_upd(state: bool) {
    if state {
        if !auto_upd_exists() {
            let curr_exe = std::env::current_exe().unwrap();
            let curr_exe_str = curr_exe.to_str().unwrap();

            let future_dt = Utc::now() + chrono::Duration::minutes(1);
            let future_dt_fmt = dt::to_windows_utcplus3(future_dt);

            Scheduler::new().unwrap()
                .name(AUTOMATIC_UPD_TASK_NAME.to_string()).unwrap()
                .folder(TASKS_PATH).unwrap()
                .action(curr_exe_str, "--update", "").unwrap()
                .time_trigger(&future_dt_fmt, None, Some("PT20M"), Some(""), None).unwrap()
                .register().unwrap();
        }

    } else {

    }

}

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
    let groups: Settings = serde_json::from_str(&settings).unwrap();
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
            .to_str()
            .unwrap(),
        &serde_json::to_string_pretty(&groups).unwrap()
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