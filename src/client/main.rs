pub mod scheduler;
use scheduler::Scheduler;
fn main() {
    println!("this is client sir");
    let _ = std::process::Command::new("cmd.exe")
                .arg("/c")
                .arg("pause")
                .status();
}