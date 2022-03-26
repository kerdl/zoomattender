use serde::Deserialize;

#[derive(Deserialize, Debug, Clone)]
pub struct ZoomData {
    pub id: String,
    pub pwd: String
}

#[derive(Deserialize, Debug, Clone)]
pub struct Task {
    pub num: u32,
    pub name: String,
    pub teacher: String,
    pub start: String,
    pub end: String,
    pub limit: Option<String>,
    pub zoom_data: ZoomData
}

#[derive(Deserialize, Debug)]
pub struct Tasks {
    pub tasks: Vec<Task>
}
