use crate::scheduler::Scheduler;
use crate::TASKS_PATH;
use crate::mappings::api_response::Tasks;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


impl Tasks {
    pub fn make(&self) -> Result<()> {
        let sc = Scheduler::new()?;

        match sc.folder_exists(TASKS_PATH) {
            true => (),
            false => {sc.make_folder(TASKS_PATH)?; ()}
        }

        for task in self.tasks.clone() {
            Scheduler::new()?
                .name(task.name)?
                .action("notepad", "", "")?
                .time_trigger(&task.start, None, None)?
                .folder(TASKS_PATH)?
                .register()?;
        }
        Ok(())
    }
}