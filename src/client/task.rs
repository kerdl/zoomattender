use crate::scheduler::Scheduler;
use crate::ZOOM_ATTENDER_PATH;
use crate::mappings::api_response::Tasks;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


impl Tasks {
    pub fn make(&self) -> Result<()> {
        let sc = Scheduler::new()?;

        match sc.folder_exists(ZOOM_ATTENDER_PATH) {
            true => (),
            false => {sc.make_folder(ZOOM_ATTENDER_PATH)?; ()}
        }

        for task in self.tasks.clone() {
            Scheduler::new()?
                .name(
                    format!("{} {} {}", 
                    task.num,
                    task.name,
                    task.teacher
                ))?
                .action("notepad", "", "")?
                .time_trigger(&task.start, None, None)?
                .folder(ZOOM_ATTENDER_PATH)?
                .register()?;
        }
        Ok(())
    }
}