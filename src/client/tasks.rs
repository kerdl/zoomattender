use app::{
    consts::*,
    scheduler::Scheduler,
    mappings::{
        local_tasks::LocalTasks,
        local_tasks::LocalTask,
        tasks::Task,
        pref_variants::PrefVariants,
        tasks::Groups,
    }
};
use clap::Parser;

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

pub fn parse_args<T: Parser>(args: &str) -> Option<T> {
    let split_args = shlex::split(args)?;
    let parsed = T::parse_from(split_args);
    Some(parsed)
}