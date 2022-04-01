use windows::{
    core::{
        PSTR, PCSTR, Error
    },
    Win32::{
        Foundation::BOOL,
        System::Threading::{
            PROCESS_INFORMATION,
            PROCESS_CREATION_FLAGS,
            STARTUPINFOEXA,
            CreateProcessA,
        },
        UI::WindowsAndMessaging::{
            MessageBoxA,
            MB_OK
        }
    }
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

#[derive(Debug)]
pub struct ProcessInfo {
    pub status: BOOL,
    pub app_name: PCSTR,
    pub info: PROCESS_INFORMATION,
    pub startup: STARTUPINFOEXA
}

pub fn create_process(
    cmdline: &str,
    creation_flag: PROCESS_CREATION_FLAGS
) -> Result<ProcessInfo> {
    let app_name: PCSTR = PCSTR(0 as *const u8);
    let _cmdline = std::ffi::CString::new(cmdline).unwrap().into_raw();
    let mut pi = PROCESS_INFORMATION::default();
    let mut si = STARTUPINFOEXA::default();
    let status = unsafe {CreateProcessA(
        app_name, 
        PSTR(_cmdline as *mut u8), 
        std::ptr::null_mut(), 
        std::ptr::null_mut(), 
        true, 
        creation_flag, 
        std::ptr::null_mut(), 
        PCSTR(0 as *const u8), 
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

pub fn show_msgbox(text: &str, caption: &str) {
    unsafe {
        MessageBoxA(None, text, caption, MB_OK);
    }
}