use crate::{
    scheduler::Scheduler,
    TASKS_PATH,
    WATCH_EXE,
    PREFS_FILE,
    ABSOLUTE_DATA_FOLDER,
    mappings::{
        local_tasks::LocalTasks,
        local_tasks::LocalTask,
        tasks::Task,
        pref_variants::PrefVariants,
        tasks::Groups,
    }
};

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub fn update_tasks(tasks: String, group: String) -> Result<Option<LocalTasks>> {
    let groups: Groups = serde_json::from_str(&tasks).unwrap();

    let prefs_str = std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(PREFS_FILE)
    ).unwrap();
    let prefs: PrefVariants = serde_json::from_str(
        &prefs_str
    ).unwrap();

    for g in groups.groups {
        if g.group == group {
            let mut created_tasks = LocalTasks::new();
            for t in g.tasks {
                let result = t.make(&prefs);
                if let Ok(task) = result {
                    created_tasks.tasks.push(task);
                }
            }
            return Ok(Some(created_tasks));
        }
    }
    Ok(None)
}

impl Task {
    pub fn make(&self, prefs: &PrefVariants) -> Result<LocalTask> {
        let mut id = self.zoom_data[0].data.id.to_string();
        let mut pwd = self.zoom_data[0].data.pwd.to_string();

        if self.zoom_data.len() > 1 {
            for tchr in self.zoom_data.clone() {
                if prefs.teachers.contains(&tchr.name) {
                    id = tchr.data.id;
                    pwd = tchr.data.pwd;
                    break;
                }
            }
        }

        let args = format!("-end {} -id {} -pwd {}", self.end, id, pwd);
        Scheduler::new()?
            .name(self.name.clone())?
            .action(
                ABSOLUTE_DATA_FOLDER
                    .parent()
                    .unwrap()
                    .join(WATCH_EXE)
                    .to_str()
                    .unwrap(), &args, "")?
            .time_trigger(&self.start, None, None, None, None)?
            .folder(TASKS_PATH)?
            .register()?;
        Ok(LocalTask::new(
            self.name.clone(), 
            self.start.clone(), 
            self.end.clone(), 
            id, 
            pwd
        ))
    }
}