pub mod scheduler;
pub mod task;
pub mod mappings;

use serde_json;
use mappings::Tasks;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

const ZOOM_ATTENDER_PATH: &str = "\\ZoomAttender";


fn main() -> Result<()> {
    println!("this is client sir");
    let resp = std::fs::read_to_string("resp.json").unwrap();
    let des: Tasks = serde_json::from_str(&resp).unwrap();
    println!("{:?}", des);
    des.make()?;
    Ok(())
    //let _ = std::process::Command::new("cmd.exe")
    //            .arg("/c")
    //            .arg("pause")
    //            .status();
}