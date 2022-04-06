use crate::mappings::local_tasks::{LocalTasks, LocalTask};

impl LocalTask {
    pub fn new(
        name: String, 
        start: String, 
        end: String, 
        id: String, 
        pwd: String
    ) -> Self {
        Self {
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