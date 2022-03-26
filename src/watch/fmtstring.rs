pub struct FmtString ();
impl FmtString {
    /// \"--url=zoommtg://zoom.us/join?action=join&confno={id}&pwd={pwd}\"
    pub fn zoom_args(id: &str, pwd: &str) -> String {
        format!(
            "\"--url=zoommtg://zoom.us/join?action=join&confno={id}&pwd={pwd}\""
        )
    }

    /// cmd /c %APPDATA%\\Zoom\\bin\\Zoom.exe {args}
    pub fn zoom_cmdline(args: &str) -> String {
        format!(
            "cmd /c %APPDATA%\\Zoom\\bin\\Zoom.exe {args}"
        )
    }
}