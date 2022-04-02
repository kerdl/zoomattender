use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PrefVariants {
    pub teachers: Vec<String>
}