use crate::DATA_FOLDER;
use crate::ABSOLUTE_DATA_FOLDER;
use serde;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub fn data_folder() -> Result<std::path::PathBuf> {
    let curr_path = std::env::current_exe()?;
    let mut path = std::path::PathBuf::from(
        curr_path.parent().unwrap()
    );
    path.push(DATA_FOLDER);

    Ok(path)
}

pub fn default_json<T: serde::Serialize>(
    fname: &str, 
    json_struct: T
) -> Result<()> {
    let write = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(fname), 
        &serde_json::to_string_pretty(&json_struct)?
    );
    if write.is_err() {
        return Err(write.unwrap_err().into());
    }
    Ok(())
}
