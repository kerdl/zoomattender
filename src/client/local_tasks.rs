use crate::mappings::local_tasks::{LocalTasks, LocalTask};

impl LocalTask {
    pub fn new(
        enabled: bool,
        name: String, 
        start: String, 
        end: String, 
        id: String, 
        pwd: Option<String>
    ) -> Self {
        Self {
            enabled,
            name,
            start,
            end,
            id,
            pwd
        }
    }
}

impl LocalTasks {
    pub fn new() -> Self {
        Self {
            tasks: vec![]
        }
    }
}