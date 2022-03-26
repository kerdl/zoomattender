use windows::{
    Win32::Foundation::{
        BOOL,
        HWND,
        LPARAM
    },
    Win32::UI::WindowsAndMessaging::{
        EnumWindows,
        GetWindowTextW
    }, 
};
use ::core::time;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


extern "system" fn enum_window(
    window: HWND, 
    winds_struct: LPARAM
) -> BOOL {
    unsafe {
        let winds: &mut Vec<String> = std::mem::transmute(winds_struct);
        let mut text: [u16; 512] = [0; 512];
        let len = GetWindowTextW(window, &mut text);
        let text = String::from_utf16_lossy(&text[..len as usize]);

        if !text.is_empty() {
            winds.push(text);
        }

        true.into()
    }
}

pub struct Watchdog {
    window_names: Vec<String>,
    windname_len_thresh: usize,
    cooldown: u64,
    max_missing: u64
}

impl Watchdog {
    pub fn new(
        window_names: Vec<String>,
        windname_len_thresh: usize,
        cooldown: u64,
        max_missing: u64
    ) -> Result<Self> {
        Ok(Self {
            window_names,
            windname_len_thresh,
            cooldown,
            max_missing
        })
    }

    pub fn opened(&self) -> bool {
        let mut winds: Vec<String> = vec![];
        unsafe {
            let _ = EnumWindows(
                Some(enum_window), 
                LPARAM(&mut winds as *mut _ as _)
            ).ok();
        };

        let mut checks: Vec<bool> = vec![];
        for window in self.window_names.clone() {
            let contains = winds.iter().any(
                |e| e.starts_with(&window) && 
                e.len() <= window.len() + self.windname_len_thresh
            );
            checks.push(contains);
        }

        checks.iter().any(|e| e == &true)
    }

    pub fn watch(&self) {
        let mut counter: u64 = 0;
        loop {
            if counter >= self.max_missing {
                break
            }

            if self.opened() {
                counter = 0;
                println!("ok found");
            }
            else {
                counter += 1;
                println!("where");
            }
            std::thread::sleep(
                time::Duration::from_secs(self.cooldown)
            );
        }
    }
}