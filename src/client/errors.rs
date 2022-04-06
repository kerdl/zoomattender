use std::{error::Error, fmt};

#[derive(Debug, Clone)]
pub struct TeacherPrefNotDefined;
impl Error for TeacherPrefNotDefined {}
impl fmt::Display for TeacherPrefNotDefined {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Got multiple teachers but prefered teacher is not defined")
    }
}
