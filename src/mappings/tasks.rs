use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ZoomData {
    pub id: String,
    pub pwd: String
}

impl PartialEq for ZoomData {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id && self.pwd == other.pwd
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NamedZoomData {
    pub name: String,
    pub data: ZoomData
}

impl PartialEq for NamedZoomData {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name && self.data == other.data
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Task {
    pub name: String,
    pub start: String,
    pub end: String,
    pub variants: u32,
    pub zoom_data: Vec<NamedZoomData>
}

impl PartialEq for Task {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name && 
        self.start == other.start && 
        self.end == other.end && 
        self.variants == other.variants && 
        self.zoom_data == other.zoom_data
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Tasks {
    pub tasks: Vec<Task>
}

impl PartialEq for Tasks {
    fn eq(&self, other: &Self) -> bool {
        self.tasks == other.tasks
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Group {
    pub group: String,
    pub tasks: Vec<Task>
}

impl PartialEq for Group {
    fn eq(&self, other: &Self) -> bool {
        self.group == other.group && self.tasks == other.tasks
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Groups {
    pub groups: Vec<Group>
}

impl Default for Groups {
    fn default() -> Self {
        Groups {
            groups: Vec::new()
        }
    }
}

impl PartialEq for Groups {
    fn eq(&self, other: &Self) -> bool {
        self.groups == other.groups
    }
}
