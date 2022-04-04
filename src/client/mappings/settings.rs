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

impl Settings {
    pub fn default() -> Self {
        Settings {
            tasks: Tasks {
                api_url: "https://api.npoint.io/3c76aea653761267e1f2".to_string(),
                group: None
            },
            zoom: Zoom {
                zoom_path: "%APPDATA%\\Zoom\\bin\\Zoom.exe".to_string(),
            },
            rejoin: Rejoin {
                do_rejoin: true,
                max_no_windows: 2,
                zoom_language: None,
                rejoin_confirm_await: 10,
                do_not_rejoin_end: 10
            },
            conflicts: Conflicts {
                kill_zoom: true
            },
            notifications: Notifications {
                task_upd_notify: false,
                questionable_zoom_variant: true
            }
        }
    }
}