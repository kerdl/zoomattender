use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ZoomData {
    pub id: String,
    pub pwd: String
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NamedZoomData {
    pub name: String,
    pub data: ZoomData
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    pub name: String,
    pub start: String,
    pub end: String,
    pub zoom_data: Vec<NamedZoomData>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Tasks {
    pub tasks: Vec<Task>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Group {
    pub group: String,
    pub tasks: Vec<Task>
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Groups {
    pub groups: Vec<Group>
}