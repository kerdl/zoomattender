use lazy_static::lazy_static;

lazy_static! {
    pub static ref ABSOLUTE_DATA_FOLDER: std::path::PathBuf = {
        let curr_path = std::env::current_exe()
            .expect("Failed to get current executable path");
        let mut path = std::path::PathBuf::from(
            curr_path.parent().unwrap()
        );
        path.push(DATA_FOLDER);
        path
    };
}

pub const AUTOMATIC_UPD_TASK_NAME: &str = "_Automatic_Update";
pub const TASKS_PATH: &str = "\\ZoomAttender";
pub const WATCH_EXE: &str = "watch.exe";
pub const DATA_FOLDER: &str = "zoomattender_data";
pub const SETTINGS_FILE: &str = "settings.json";
pub const PREFS_FILE: &str = "prefs.json";
pub const WINDNAMES_FILE: &str = "windnames.json";