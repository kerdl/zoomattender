use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LocalTask {
    pub name: String,
    pub start: String,
    pub end: String,
    pub id: String,
    pub pwd: String
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LocalTasks {
    pub tasks: Vec<LocalTask>,
}