pub mod watchdog;
use watchdog::Watchdog;
pub mod window;
use windows::{
    Win32::{
        Foundation::{BOOL, GetLastError},
    }
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


fn run_zoom(id: &str, pwd: &str) -> Result<()> {
    println!("here i cum id {} pwd {}", id, pwd);

    let args = format!(
        "\"--url=zoommtg://zoom.us/join?action=join&confno={}&pwd={}\"", id, pwd
    );
    let cmdline = format!("cmd /c %APPDATA%\\Zoom\\bin\\Zoom.exe {}", args);

    let info = window::create_process(&cmdline)?;
    if info.status == BOOL(0) {
        let panicstr = format!(
            "wtf process not created!!! {:?}", 
            unsafe {GetLastError()}
        );
        panic!("{}", panicstr)
    };

    Ok(())
}

fn main() -> Result<()> {
    let window_names: Vec<&str> = vec![
        "ConfMeetingNotfiyWnd",
        "Zoom Meeting",
        "Waiting for Host"
    ];

    //let args: Vec<String> = std::env::args().collect();
    let args: Vec<String> = vec![
        ".\\target\\debug\\zoomattender.exe".to_string(), 
        "--watch".to_string(), 
        "-id".to_string(), "9608553019".to_string(), 
        "-pwd".to_string(), "Y3NERFVlYVc3dkdUM2pxc21TanYxdz09".to_string()
    ];
    println!("{:?}", args);

    if args.contains(&String::from("--watch")) {

        for arg in ["-id", "-pwd"] {
            if !args.contains(&String::from(arg)) {
                panic!("both args are required: -id, -pwd");
            }
        }

        let id_i = args.iter().position(|r| r == "-id").unwrap();
        let id = &args[id_i + 1];

        let pwd_i = args.iter().position(|r| r == "-pwd").unwrap();
        let pwd = &args[pwd_i + 1];

        let wd = Watchdog::new(window_names, 1, 10)?;
        loop {
            run_zoom(id, pwd)?;
            wd.watch();
            window::show_msgbox("pososesh) ok?", "hui")
        }
        
        return Ok(())
    }
    else {
        return Ok(())
    }
}
