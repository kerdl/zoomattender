use crate::scheduler::Scheduler;
use crate::TASKS_PATH;
use crate::mappings::tasks::Task;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


impl Task {
    pub fn make(&self) -> Result<()> {
        Scheduler::new()?
            .name(self.name.clone())?
            .action("notepad", "", "")?
            .time_trigger(&self.start, None, None)?
            .folder(TASKS_PATH)?
            .register()?;
        Ok(())
    }
}