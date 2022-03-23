use windows::{
    core::{
        PCSTR
    },
    Win32::Foundation::{
        BOOL,
        HWND,
        LPARAM
    },
    Win32::UI::WindowsAndMessaging::{
        WNDENUMPROC,
        FindWindowA, 
        EnumWindows,
        GetWindowTextW
    }, 
};
use ::core::time;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


extern "system" fn enum_window(window: HWND, _: LPARAM) -> BOOL {
    unsafe {
        let mut text: [u16; 512] = [0; 512];
        let len = GetWindowTextW(window, &mut text);
        let text = String::from_utf16_lossy(&text[..len as usize]);

        if !text.is_empty() {
            println!("{}", text);
        }

        true.into()
    }
}

pub struct Watchdog<'a> {
    window_names: Vec<&'a str>,
    cooldown: u64
}

impl<'a> Watchdog<'a> {
    pub fn new(
        window_names: Vec<&'a str>,
        cooldown: u64
    ) -> Result<Self> {
        Ok(Self {
            window_names,
            cooldown
        })
    }

    pub fn opened(&self) -> bool {
        let mut hwnd: HWND;
        //unsafe {
        //    let b = EnumWindows(Some(enum_window), LPARAM(0)).ok();
        //    println!("{:?}", b)
        //};
        
        unsafe {
            for window in self.window_names.clone() {
                hwnd = FindWindowA(PCSTR::default(), window);
                if !hwnd.is_invalid() {
                    return true
                }
            }
        }
        return false
    }

    pub fn watch(&self) {
        loop {
            if self.opened() {
                println!("ok found");
            }
            else {
                println!("where");
            }
            std::thread::sleep(
                time::Duration::from_secs(self.cooldown)
            );
        }
    }
}