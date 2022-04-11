use crate::fmtstring::FmtString;
use crate::window;
use windows::{
    Win32::{
        Foundation::{BOOL, GetLastError},
        System::Threading::{CREATE_NO_WINDOW, CREATE_NEW_CONSOLE}
    }
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


pub struct Zoom {
    path: String,
}
impl Zoom {
    pub fn new(path: String) -> Self {
        Self {
            path
        }
    }

    pub fn run_from_id_pwd(&self, id: &str, pwd: &str) -> Result<()> {
        let args = FmtString::zoom_args(id, pwd);

        let mut cmdline = "cmd /c".to_string();

        let path = self.path.clone();
        cmdline.push_str(" ");
        cmdline.push_str(&self.path);
        cmdline.push_str(" ");
        cmdline.push_str(&args);

        println!("{}", cmdline);

        let info = window::create_process(
            &cmdline, 
            CREATE_NO_WINDOW
        )?;

        if info.status == BOOL(0) {
            Err(format!(
                "wtf process {} not created!!! {:?}",
                cmdline, 
                unsafe {GetLastError()}
            ))?
        };

        Ok(())
    }
}