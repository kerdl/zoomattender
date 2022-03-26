use crate::fmtstring::FmtString;
use crate::window;
use windows::{
    Win32::{
        Foundation::{BOOL, GetLastError},
        System::Threading::CREATE_NO_WINDOW
    }
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


pub struct Zoom ();
impl Zoom {
    pub fn run_from_id_pwd(id: &str, pwd: &str) -> Result<()> {
        let args = FmtString::zoom_args(id, pwd);
        let cmdline = FmtString::zoom_cmdline(&args);

        let info = window::create_process(
            &cmdline, 
            CREATE_NO_WINDOW
        )?;

        if info.status == BOOL(0) {
            panic!("{}", format!(
                "wtf process not created!!! {:?}", 
                unsafe {GetLastError()}
            ))
        };

        Ok(())
    }
}