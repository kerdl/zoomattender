use chrono::{DateTime, Utc};

pub fn to_windows_utcplus3(dt: DateTime<Utc>) -> String{
    dt.format("%Y-%m-%dT%H:%M:%S+03:00").to_string()
}