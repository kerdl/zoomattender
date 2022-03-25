use serde::Deserialize;
use crate::scheduler::Scheduler;


type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

#[derive(Deserialize, Debug, Clone)]
struct ZoomData {
    url: String,
    id: String,
    pwd: String
}

#[derive(Deserialize, Debug, Clone)]
struct Task {
    name: String,
    teacher: String,
    start: String,
    end: String,
    zoom_data: ZoomData
}

#[derive(Deserialize, Debug)]
pub struct Tasks {
    tasks: Vec<Task>
}

impl Tasks {
    pub fn make(&self) -> Result<()> {
        for task in self.tasks.clone() {
            Scheduler::new()?
                .name("gg")?
                .action("notepad", "", "")?
                .time_trigger(&task.start, Some(&task.end), None)?
                .folder("\\ZoomAttender")?
                .test();
        }
        Ok(())
    }
}