use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct English {
    pub label: String,
    pub names: Vec<String>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Russian {
    pub label: String,
    pub names: Vec<String>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Windnames {
    pub ru: Russian,
    pub en: English
}

impl Windnames {
    pub fn default() -> Self {
        Self {
            ru: Russian { 
                label: "Русский".to_string(), 
                names: vec![
                "ConfMeetingNotfiyWnd".to_string(),
                "Соединение".to_string(),
                "Zoom Конференция".to_string(),
                "Ожидание организатора".to_string(),
                ]
            },
            en: English { 
                label: "English".to_string(), 
                names: vec![
                "ConfMeetingNotfiyWnd".to_string(),
                "Connecting".to_string(),
                "Zoom Meeting".to_string(),
                "Waiting for Host".to_string()
            ]
            }
        }
    }
}