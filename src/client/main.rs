use serde_json;
mod scheduler;
use scheduler::Scheduler;
mod task;
use task::Tasks;


fn main() {
    println!("this is client sir");
    let resp = std::fs::read_to_string("resp.json").unwrap();
    let des: Tasks = serde_json::from_str(&resp).unwrap();
    println!("{:?}", des);
    des.make();
    //let _ = std::process::Command::new("cmd.exe")
    //            .arg("/c")
    //            .arg("pause")
    //            .status();
}