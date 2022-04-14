use windows::{
    core::{
        PCWSTR, PWSTR
    },
    Win32::{
        Foundation::BOOL,
        System::Threading::{
            CREATE_NO_WINDOW,
            PROCESS_INFORMATION,
            PROCESS_CREATION_FLAGS,
            STARTUPINFOEXW,
            CreateProcessW,
        },
    }
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub fn to_cmdline(line: &str) -> String {
    format!("cmd /c {}", line)
}

pub fn kill_all(name: &str) {
    let _ = create_process(
        &format!("cmd /c taskkill /IM \"{}\" /F", name), 
        CREATE_NO_WINDOW
    );
}

#[derive(Debug)]
pub struct ProcessInfo {
    pub status: BOOL,
    pub app_name: PCWSTR,
    pub info: PROCESS_INFORMATION,
    pub startup: STARTUPINFOEXW
}

pub fn create_process(
    cmdline: &str,
    creation_flag: PROCESS_CREATION_FLAGS
) -> Result<ProcessInfo> {
    let app_name: PCWSTR = PCWSTR(0 as *const u16);
    let mut pi = PROCESS_INFORMATION::default();
    let mut si = STARTUPINFOEXW::default();

    let status = unsafe {CreateProcessW(
        app_name, 
        PWSTR(cmdline.encode_utf16().collect::<Vec<u16>>().as_mut_ptr()), 
        std::ptr::null_mut(), 
        std::ptr::null_mut(), 
        true, 
        creation_flag, 
        std::ptr::null_mut(), 
        PCWSTR(0 as *const u16), 
        &mut si.StartupInfo, 
        &mut pi
    )};

    Ok(ProcessInfo {
        status, 
        app_name,
        info: pi,
        startup: si
    })
}
