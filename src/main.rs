pub mod watchdog;
use watchdog::Watchdog;
use windows::{
    core::{
        PSTR, PCSTR
    },
    Win32::{
        Foundation::GetLastError,
        System::Threading::{
            PROCESS_INFORMATION,
            PROCESS_CREATION_FLAGS,
            STARTUPINFOEXA,
            CreateProcessA,
            
        }
    }
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


fn run_zoom(id: &str, pwd: &str) -> Result<()> {
    println!("here i cum id {} pwd {}", id, pwd);

    let mut pi = PROCESS_INFORMATION::default();
    let mut si = STARTUPINFOEXA::default();

    let args = format!(
        "\"--url=zoommtg://zoom.us/join?action=join&confno={}&pwd={}\"", id, pwd
    );
    let cmdline = format!("cmd /c %APPDATA%\\Zoom\\bin\\Zoom.exe {}", args);

    let lp_application_name: PCSTR = PCSTR(0 as *const u8);
    let lp_command_line = std::ffi::CString::new(cmdline).unwrap().into_raw();

    unsafe {
        let result = CreateProcessA(
            lp_application_name, 
            PSTR(lp_command_line as *mut u8), 
            std::ptr::null_mut(), 
            std::ptr::null_mut(), 
            true, 
            PROCESS_CREATION_FLAGS(0), 
            std::ptr::null_mut(), 
            PCSTR(0 as *const u8), 
            &mut si.StartupInfo, 
            &mut pi
        );
        println!("{:?}", result);
    }

    //let res = std::process::Command::new("cmd")
    //    .args(["/c", "%APPDATA%\\Zoom\\bin\\Zoom.exe", &args])
    //    .spawn();
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

        run_zoom(id, pwd)?;

        let wd = Watchdog::new(window_names, 1)?;
        wd.watch();
        return Ok(())
    }
    else {
        return Ok(())
    }
}
