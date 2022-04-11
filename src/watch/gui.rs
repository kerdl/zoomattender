use crate::{SETTINGS};

#[tauri::command]
pub fn session() -> String {
    return "watch".to_string();
}

#[tauri::command]
pub fn timeout() -> u32 {
    SETTINGS.rejoin.rejoin_confirm_await
}