use crate::mappings::local_tasks::{LocalTasks, LocalTask};

impl LocalTask {
    pub fn new(
        enabled: bool,
        name: String, 
        description: String,
        start: String, 
        end: String, 
        id: String, 
        pwd: Option<String>
    ) -> Self {
        Self {
            enabled,
            name,
            description,
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