pub struct FmtString ();
impl FmtString {
    /// \"--url=zoommtg://zoom.us/join?action=join&confno={id}&pwd={pwd}\"
    pub fn zoom_args(id: &str, pwd: Option<&str>) -> String {
        let mut args = "\"--url=zoommtg://zoom.us/join?action=join&confno=".to_string();
        args.push_str(id);

        if pwd.is_some() && pwd.unwrap().len() > 0 {
            args.push_str("&pwd=");
            args.push_str(pwd.unwrap());
        }
        args.push_str("\"");

        args
    }
}