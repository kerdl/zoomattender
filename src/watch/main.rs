//#![windows_subsystem = "windows"]

pub mod watchdog;
pub mod fmtstring;
pub mod zoom;

use app::{window, args};
use clap::Parser;
use watchdog::Watchdog;
use zoom::Zoom;
use ::core::time;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


fn main() -> Result<()> {
    println!("{:?}", std::env::args());
    let args = args::WatchArgs::parse();
    
    let id = &args.id;//"9608553019"; 
    let pwd = &args.pwd.unwrap();//"Y3NERFVlYVc3dkdUM2pxc21TanYxdz09";

    let window_names = vec![
        "ConfMeetingNotfiyWnd".to_string(),
        "Connecting".to_string(),
        "Zoom Meeting".to_string(),
        "Waiting for Host".to_string()
    ]; 

    let wd = Watchdog::new(window_names, 3, 1, 2)?;
    loop {
        Zoom::run_from_id_pwd(id, pwd)?;
        std::thread::sleep(time::Duration::from_secs(10));
        wd.watch();
        window::show_msgbox("pososesh) ok?", "hui")
    }
    Ok(())
}

