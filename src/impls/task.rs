use crate::{
    args,
    scheduler::Scheduler,
    consts::*,
    mappings::{
        tasks::Task, 
        pref_variants::PrefVariants, 
        local_tasks::LocalTask
    }
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


impl Task {
    pub fn make(&self, prefs: &PrefVariants) -> Result<LocalTask> {
        let self_serialize = serde_json::to_string(self)?;

        let mut id = "0".to_string();
        let mut pwd = "".to_string();

        if self.zoom_data.len() > 1 {
            for tchr in self.zoom_data.clone() {
                if prefs.teachers.contains(&tchr.name) {
                    id = tchr.data.id;
                    pwd = tchr.data.pwd;
                    break;
                }
            }
        }
        else {
            id = self.zoom_data[0].data.id.clone();
            pwd = self.zoom_data[0].data.pwd.clone();
        }

        let args = args::WatchArgs::new(
            self.name.clone(), 
            self.start.clone(), 
            self.end.clone(), 
            id.clone(), 
            Some(pwd.clone())
        ).stringify();

        Scheduler::new()?
            .name(self.name.clone())?
            .description(self_serialize.clone())?
            .action(
                ABSOLUTE_FOLDER
                    .join(WATCH_EXE)
                    .to_str()
                    .unwrap(), &args, "")?
            .time_trigger(&self.start, None, None, None, None)?
            .folder(TASKS_PATH)?
            .register()?;
        Ok(LocalTask::new(
            true,
            self.name.clone(), 
            self_serialize,
            self.start.clone(), 
            self.end.clone(), 
            id, 
            Some(pwd)
        ))
    }
}