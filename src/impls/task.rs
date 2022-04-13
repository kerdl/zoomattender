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

        let is_full_zoom_data = self.zoom_data.len() == self.variants as usize;
        let mut found_variant = false;
        let mut id = "0".to_string();
        let mut pwd = "".to_string();

        for tchr in self.zoom_data.clone() {
            if prefs.teachers.contains(&tchr.name) {
                found_variant = true;
                id = tchr.data.id;
                pwd = tchr.data.pwd;
                break;
            }
        }

        if is_full_zoom_data && !found_variant && self.zoom_data.len() < 2 {
            id = self.zoom_data[0].data.id.clone();
            pwd = self.zoom_data[0].data.pwd.clone();
        }

        let mut args_pwd = None;
        if pwd.len() > 0 {
            args_pwd = Some(pwd);
        }

        let args = args::WatchArgs::new(
            self.name.clone(), 
            self.start.clone(), 
            self.end.clone(), 
            id.clone(), 
            args_pwd.clone()
        ).stringify();

        let must_enable = {
            if id == "0" {
                false
            } else {
                true
            }
        };

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
            .enabled(must_enable)?
            .register()?;
            
        Ok(LocalTask::new(
            true,
            self.name.clone(), 
            self_serialize,
            self.start.clone(), 
            self.end.clone(), 
            id, 
            args_pwd
        ))
    }
}