use app::{consts::*, args};
use crate::{ARGS, SETTINGS, window};
use chrono::DateTime;
use windows::Win32::System::Threading::CREATE_NO_WINDOW;

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
    println!("{}", ARGS.name);
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
pub fn run_client(state: Option<String>) {
    let a = args::ClientArgs::new(state, false).stringify();
    let path = window::to_cmdline(ABSOLUTE_FOLDER.join(CLIENT_EXE).to_str().unwrap());
    window::create_process(&format!("{} {}", path, a), CREATE_NO_WINDOW);
}

#[tauri::command]
pub fn exit_main() {
    std::process::exit(0);
}