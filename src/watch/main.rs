//#![windows_subsystem = "windows"]

pub mod watchdog;
pub mod fmtstring;
pub mod zoom;

use app::{
    mappings::{
        settings::Settings,
        windnames::Windnames,
    },
    window, 
    args, 
    consts::*
};
use serde_json;
use clap::Parser;
use watchdog::Watchdog;
use windows::Win32::System::Threading::CREATE_NO_WINDOW;
use zoom::Zoom;
use std::time::SystemTime;
use chrono::{DateTime, Duration};
use ::core::time;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


fn main() -> Result<()> {
    println!("{:?}", std::env::args());
    let args = args::WatchArgs::parse();
    
    let id = &args.id;//"9608553019"; 
    let pwd = &args.pwd.unwrap();//"Y3NERFVlYVc3dkdUM2pxc21TanYxdz09";

    let settings_str = std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
    )?.to_string();
    let settings: Settings = serde_json::from_str(&settings_str)?;

    let windnames_str = std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(WINDNAMES_FILE)
    )?.to_string();
    let windnames: Windnames = serde_json::from_str(&windnames_str)?;

    if settings.conflicts.kill_zoom {
        window::create_process(
            "cmd /c taskkill /IM \"Zoom.exe\" /F", 
            CREATE_NO_WINDOW
        )?;
        println!("Zoom killed");
    }

    let zoom = Zoom::new(settings.zoom.zoom_path);

    if settings.rejoin.do_rejoin {
        let windows_to_watch: Vec<String>;
        
        match settings.rejoin.zoom_language.unwrap().as_str() {
            "ru" => windows_to_watch = windnames.ru.names.clone(),
            "en" => windows_to_watch = windnames.en.names.clone(),
            _ => panic!("Unsupported Zoom language")
        }
        println!("{:?}", windows_to_watch);

        let wd = Watchdog::new(
            windows_to_watch, 3, 1, 
            settings.rejoin.max_no_windows.into()
        )?;

        let end = DateTime::parse_from_rfc3339(&args.end)?;

        let do_not_rejoin_time = end - Duration::minutes(settings.rejoin.do_not_rejoin_end.into());

        println!("{:?}", do_not_rejoin_time);

        loop {
            let now = chrono::offset::Local::now();
            if now > do_not_rejoin_time {
                return Ok(());
            }
            zoom.run_from_id_pwd(id, pwd)?;
            std::thread::sleep(time::Duration::from_secs(
                settings.rejoin.do_not_watch.into())
            );
            wd.watch();
            window::show_msgbox("pososesh) ok?", "hui")
        }
    }
    else {
        zoom.run_from_id_pwd(id, pwd)?;
    }

    Ok(())
}

