use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Notifications {
    pub task_upd_notify: bool,
    pub questionable_zoom_variant: bool
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Conflicts {
    pub kill_zoom: bool
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Rejoin {
    pub do_rejoin: bool,
    pub max_no_windows: u32,
    pub zoom_language: Option<String>,
    pub zoom_windnames: Option<String>,
    pub rejoin_confirm_await: u32,
    pub do_not_rejoin_end: u32
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Zoom {
    pub zoom_path: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Tasks {
    pub api_url: String,
    pub group: Option<String>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Settings {
    pub tasks: Tasks,
    pub zoom: Zoom,
    pub rejoin: Rejoin,
    pub conflicts: Conflicts,
    pub notifications: Notifications
}