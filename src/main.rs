pub mod watchdog;
use watchdog::Watchdog;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;



fn main() -> Result<()> {
    let window_names: Vec<&str> = vec![
        "ConfMeetingNotfiyWnd",
        "Zoom Meeting",
        "Waiting for Host"
    ];

    let args: Vec<String> = std::env::args().collect();
    println!("{:?}", args);

    if args.contains(&String::from("--watch")) {
        let wd = Watchdog::new(window_names, 1)?;
        wd.watch();
        return Ok(())
    }
    else {
        return Ok(())
    }
}
