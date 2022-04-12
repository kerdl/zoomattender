use crate::{ARGS, SETTINGS};
use chrono::DateTime;

#[tauri::command]
pub fn session() -> String {
    return "watch".to_string();
}

#[tauri::command]
pub fn timeout() -> u32 {
    SETTINGS.rejoin.rejoin_confirm_await
}

#[tauri::command]
pub fn task_name() -> String {
    ARGS.name.clone()
}

#[tauri::command]
pub fn task_start() -> String {
    let start = DateTime::parse_from_rfc3339(&ARGS.start);
    start.unwrap().format("%H:%M").to_string()
}

#[tauri::command]
pub fn task_end() -> String {
    let end = DateTime::parse_from_rfc3339(&ARGS.end);
    end.unwrap().format("%H:%M").to_string()
}

#[tauri::command]
pub fn exit_main() {
    std::process::exit(0);
}