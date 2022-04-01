//#![windows_subsystem = "windows"]

pub mod watchdog;
pub mod fmtstring;
pub mod zoom;

use app::window;
use clap::Parser;
use watchdog::Watchdog;
use zoom::Zoom;
use ::core::time;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


#[derive(clap::Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    #[clap(short, long)]
    id: Option<String>,
    #[clap(short, long)]
    pwd: Option<String>,
    #[clap(short, long)]
    window_names: Vec<String>
}

fn main() -> Result<()> {
    let _args = Args::parse();

    let id = "9608553019"; //&args.id.unwrap();
    let pwd = "Y3NERFVlYVc3dkdUM2pxc21TanYxdz09"; //&args.pwd.unwrap();

    let window_names = vec![
        "ConfMeetingNotfiyWnd".to_string(),
        "Connecting".to_string(),
        "Zoom Meeting".to_string(),
        "Waiting for Host".to_string()
    ]; //&args.window_names;

    let wd = Watchdog::new(window_names, 3, 1, 2)?;
    loop {
        Zoom::run_from_id_pwd(id, pwd)?;
        std::thread::sleep(time::Duration::from_secs(10));
        wd.watch();
        window::show_msgbox("pososesh) ok?", "hui")
    }
}

