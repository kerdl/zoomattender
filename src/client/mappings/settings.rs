use serde::Deserialize;

#[derive(Deserialize, Debug, Clone)]
struct Notifications {
    task_upd_notify: bool,
    questionable_zoom_variant: bool
}

#[derive(Deserialize, Debug, Clone)]
struct Conflicts {
    kill_zoom: bool
}

#[derive(Deserialize, Debug, Clone)]
struct Rejoin {
    do_rejoin: bool,
    max_nowindows: u32,
    zoom_language: Option<String>,
    zoom_windnames: Option<String>,
    rejoin_confirm_await: u32,
    donot_rejoin_end: u32
}

#[derive(Deserialize, Debug, Clone)]
struct Zoom {
    zoom_path: String,
    args: String
}

#[derive(Deserialize, Debug, Clone)]
struct Tasks {
    api_url: String,
    group: Option<String>
}

#[derive(Deserialize, Debug, Clone)]
struct Settings {
    tasks: Tasks,
    zoom: Zoom,
    rejoin: Rejoin,
    conflicts: Conflicts,
    notifications: Notifications
}