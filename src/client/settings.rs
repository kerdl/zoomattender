use crate::mappings::settings::{
    Settings,
    Tasks,
    Zoom,
    Rejoin,
    Conflicts,
    Notifications
};

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
                max_nowindows: 2,
                zoom_language: None,
                zoom_windnames: None,
                rejoin_confirm_await: 10,
                donot_rejoin_end: 10
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