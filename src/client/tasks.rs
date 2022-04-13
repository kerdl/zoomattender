use crate::{
    gui, 
    local_fs
};
use app::{
    consts::*,
    mappings::{
        tasks::Groups,
        local_tasks::LocalTasks,
        pref_variants::PrefVariants,
    }
};
use clap::Parser;
use serde_json;
use reqwest;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub struct TasksResponseVersion {
    pub new: Groups,
    pub old: Groups,
}

pub fn fetch_tasks(url: &str) -> Result<TasksResponseVersion> {
    let old_resp: Groups = {
        let s = std::fs::read_to_string(
            ABSOLUTE_DATA_FOLDER.join(LAST_TASKS_RESPONSE)
        )?;
        serde_json::from_str(&s)?
    };

    let new_resp = {
        let s = reqwest::blocking::get(url)?.text()?;
        serde_json::from_str(&s)?
    };

    local_fs::default_json(LAST_TASKS_RESPONSE, &new_resp)?;

    Ok(TasksResponseVersion {old: old_resp, new: new_resp})
}

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
            gui::delete_all_tasks();
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