//#![windows_subsystem = "windows"]

pub mod watchdog;
use watchdog::Watchdog;
pub mod window;
use windows::{
    Win32::{
        Foundation::{BOOL, GetLastError},
        System::Threading::CREATE_NO_WINDOW
    }
};
use ::core::time;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

fn run_zoom(id: &str, pwd: &str) -> Result<()> {
    println!("here i cum id {} pwd {}", id, pwd);

    let args = format!(
        "\"--url=zoommtg://zoom.us/join?action=join&confno={}&pwd={}\"", id, pwd
    );
    let cmdline = format!("cmd /c %APPDATA%\\Zoom\\bin\\Zoom.exe {}", args);

    let info = window::create_process(&cmdline, CREATE_NO_WINDOW)?;
    if info.status == BOOL(0) {
        panic!("{}", format!(
            "wtf process not created!!! {:?}", unsafe {GetLastError()}
        ))
    };

    Ok(())
}

fn main() -> Result<()> {
    let window_names: Vec<&str> = vec![
        "ConfMeetingNotfiyWnd",
        "Connecting",
        "Zoom Meeting",
        "Waiting for Host"
    ];

    //let args: Vec<String> = std::env::args().collect();
    let args: Vec<String> = vec![
        ".\\target\\debug\\zoomattender.exe".to_string(), 
        "-id".to_string(), "9608553019".to_string(), 
        "-pwd".to_string(), "Y3NERFVlYVc3dkdUM2pxc21TanYxdz09".to_string()
    ];

    if !args.contains(&String::from("-id")) {panic!("introduce -id")}
    if !args.contains(&String::from("-pwd")) {panic!("introduce -pwd")}

    let id_i = args.iter().position(|r| r == "-id").unwrap();
    let id = &args[id_i + 1];

    let pwd_i = args.iter().position(|r| r == "-pwd").unwrap();
    let pwd = &args[pwd_i + 1];

    let wd = Watchdog::new(window_names, 3, 1, 2)?;
    loop {
        run_zoom(id, pwd)?;
        std::thread::sleep(time::Duration::from_secs(10));
        wd.watch();
        window::show_msgbox("pososesh) ok?", "hui")
    }
}

