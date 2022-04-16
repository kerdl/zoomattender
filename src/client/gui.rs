use app::{
    consts::*,
    scheduler::Scheduler,
    mappings::{
        pref_variants::PrefVariants,
        settings::Settings,
        local_tasks::{
            LocalTasks, 
            LocalTask
        },
    },
    args
};
use crate::{
    ARGS,
    window,
    dt,
    tasks
};
use webbrowser;
use windows::{
    core::Interface,
    Win32::{
        Foundation::{BSTR},
        System::{
            Threading::{
                CREATE_NO_WINDOW
            },
        TaskScheduler::{
            ITimeTrigger,
            IExecAction
        }
    }}
};
use serde_json;
use chrono::Utc;

//type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;


#[tauri::command]
pub fn session() -> String {
    return "client".to_string();
}

#[tauri::command]
pub fn fetch_tasks(url: &str, store_resp: bool) -> String {
    let versions = tasks::fetch_tasks(url, store_resp).unwrap();
    serde_json::to_string_pretty(&versions.new).unwrap()
}

#[tauri::command]
pub fn initial_state() -> String {
    if ARGS.state.is_some() {
        return ARGS.state.clone().unwrap();
    }

    return "".to_string();
}

#[tauri::command]
pub fn update_tasks(tasks: String, group: String) -> Result<String, String> {
    let result = tasks::update_tasks(tasks, group);
    match result {
        Ok(Some(tasks)) => {
            println!("got some tasks: {:?}", tasks.tasks); 
            Ok(serde_json::to_string_pretty(&tasks).unwrap())
        },
        Ok(None) => {
            println!("got no tasks");
            Ok("".to_string())
        },
        Err(e) => {
            println!("error while updating tasks: {}", e);
            Err(format!("{}", e))
        }
    }
}

pub fn auto_upd_exists() -> bool {
    let sc = Scheduler::new().unwrap();
    sc.task_exists(TASKS_PATH, AUTOMATIC_UPD_TASK_NAME).unwrap()
}

#[tauri::command]
pub fn auto_upd_turned_on() -> bool {
    let sc = Scheduler::new().unwrap();
    let task = sc.get_task(TASKS_PATH, AUTOMATIC_UPD_TASK_NAME);
    if task.is_err() {
        return false;
    };
    unsafe {task.unwrap().Enabled().unwrap() != 0}
}

#[tauri::command]
pub fn set_automatic_upd(state: bool) -> () {
    if state {
        if !auto_upd_exists() {
            let curr_exe = std::env::current_exe().unwrap();
            let curr_exe_str = curr_exe.to_str().unwrap();

            let future_dt = Utc::now() + chrono::Duration::minutes(1);
            let future_dt_fmt = dt::to_windows_utcplus3(future_dt);

            Scheduler::new().unwrap()
                .name(AUTOMATIC_UPD_TASK_NAME.to_string()).unwrap()
                .folder(TASKS_PATH).unwrap()
                .action(curr_exe_str, "--update", "").unwrap()
                .time_trigger(&future_dt_fmt, None, Some("PT20M"), Some(""), None).unwrap()
                .register().unwrap();

            println!("created automatic update task");
        }
        else {
            let sc = Scheduler::new().unwrap();
            let task = sc.get_task(TASKS_PATH, AUTOMATIC_UPD_TASK_NAME).unwrap();
            unsafe {task.SetEnabled(1);};
        }

    }
    else {
        let sc = Scheduler::new().unwrap();
        let task = sc.get_task(TASKS_PATH, AUTOMATIC_UPD_TASK_NAME);
        if task.is_err() {
            return;
        };
        unsafe {task.unwrap().SetEnabled(0);};
    }

    println!("set automatic update to {}", state);
}

#[tauri::command]
pub fn get_tasks_from_scheduler() -> Result<String, String> {
    let sc = Scheduler::new().unwrap();
    let tasks = sc.list_tasks(TASKS_PATH).unwrap();
    unsafe {
        let mut local_tasks = LocalTasks::new();
        for t in tasks {
            if !t.Name().unwrap().to_string().starts_with('_') {
                let def = t.Definition().unwrap();
                let actions = def.Actions().unwrap();
                let time_trigger = actions.Item(1).unwrap();
                let exec_action: IExecAction = time_trigger.cast().unwrap();
    
                let path = {
                    let mut ppath = BSTR::from("");
                    exec_action.Path(&mut ppath).unwrap();
                    ppath.to_string()
                };
    
                let args = {
                    let mut pargmunet = BSTR::from("");
                    exec_action.Arguments(&mut pargmunet).unwrap();
                    pargmunet.to_string()
                };
    
                let desc = {
                    let mut pdescription = BSTR::from("");
                    def.RegistrationInfo().unwrap().Description(&mut pdescription).unwrap();
                    pdescription.to_string()
                };

                let cmdline = format!("{} {}", path, args);
                let parsed = tasks::parse_args::<args::WatchArgs>(&cmdline);
                
                if parsed.is_some() {
                    let parsed = parsed.unwrap();
                    let lt = LocalTask::new(
                        t.Enabled().unwrap() != 0,
                        t.Name().unwrap().to_string(),
                        desc,
                        parsed.start,
                        parsed.end,
                        parsed.id,
                        parsed.pwd
                    );
        
                    local_tasks.tasks.push(lt);
                }
            }
        };
        println!("loaded tasks: {:?}", local_tasks);
        Ok(serde_json::to_string_pretty(&local_tasks).unwrap())
    }
}

#[tauri::command]
pub fn delete_all_tasks() -> () {
    let sc = Scheduler::new().unwrap().folder(TASKS_PATH).unwrap();
    let tasks = sc.list_tasks(TASKS_PATH).unwrap();
    
    let mut deleted_names: Vec<String> = vec![];
    unsafe {
        for t in tasks {
            let name = t.Name().unwrap().to_string();
            if !name.starts_with('_') {
                deleted_names.push(name.clone());
                sc.delete_task(&name);
            };
        };
    };
    println!("deleted tasks: {:?}", deleted_names);
}

#[tauri::command]
pub fn set_task_state(name: String, state: bool) -> () {
    let sc = Scheduler::new().unwrap();
    let tasks = sc.list_tasks(TASKS_PATH).unwrap();

    unsafe {
        for t in tasks {
            let n = t.Name().unwrap().to_string();
            if n == name {
                t.SetEnabled(state as i16);
                println!("set task state to {}: {}", state, name);
                break;
            }
        }
    }
}

#[tauri::command]
pub fn edit_task(
    name: String, 
    enabled: Option<bool>,
    start: Option<String>, 
    end: Option<String>, 
    id: Option<String>, 
    pwd: Option<String>
) -> () {
    let sc = Scheduler::new().unwrap();
    let tasks = sc.list_tasks(TASKS_PATH).unwrap();

    unsafe {
        for t in tasks {
            let n = t.Name().unwrap().to_string();
            if n == name {
                let def = t.Definition().unwrap();
                let actions = def.Actions().unwrap();
                let time_trigger = actions.Item(1).unwrap();
                let exec_action: IExecAction = time_trigger.cast().unwrap();

                let path = {
                    let mut ppath = BSTR::from("");
                    exec_action.Path(&mut ppath).unwrap();
                    ppath.to_string()
                };

                let args = {
                    let mut pargument = BSTR::from("");
                    exec_action.Arguments(&mut pargument);
                    pargument.to_string()
                };

                let desc = {
                    let mut pdescription = BSTR::from("");
                    def.RegistrationInfo().unwrap().Description(&mut pdescription).unwrap();
                    pdescription.to_string()
                };

                let cmdline = format!("{} {}", path, args);
                let mut parsed = tasks::parse_args::<args::WatchArgs>(&cmdline).unwrap();

                let trigger = def.Triggers().unwrap().Item(1).unwrap();
                let time: ITimeTrigger = trigger.cast::<ITimeTrigger>().unwrap();

                let enabled = {
                    let current = t.Enabled().unwrap() != 0;
                    if enabled.is_some() {
                        enabled.unwrap()
                    }
                    else {
                        current
                    }
                };

                println!("task is: {}", enabled);

                if start.is_some() {
                    let start = start.unwrap();
                    time.SetStartBoundary(&*start);
                    parsed.start = start;
                }

                if end.is_some() {
                    let end = end.unwrap();
                    parsed.end = end;
                }
            
                if id.is_some() {
                    let id = id.unwrap();
                    parsed.id = id;
                }
            
                if pwd.is_some() && pwd.as_ref().unwrap().len() > 0 {
                    parsed.pwd = pwd;
                }

                parsed.stringify();

                let new_args = parsed.stringify();

                Scheduler::new().unwrap()
                    .name(name).unwrap()
                    .description(desc).unwrap()
                    .folder(TASKS_PATH).unwrap()
                    .action(&path, &new_args, "").unwrap()
                    .time_trigger(&parsed.start, None, None, None, None).unwrap()
                    .enabled(enabled).unwrap()
                    .register().unwrap();

                break;
            }
        }
    }


}

#[tauri::command]
pub fn load_settings() -> String {
    std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
            .to_str()
            .unwrap()
    ).unwrap()
}

#[tauri::command]
pub fn save_settings(settings: String) -> () {
    let groups: Settings = serde_json::from_str(&settings).unwrap();
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
            .to_str()
            .unwrap(),
        &serde_json::to_string_pretty(&groups).unwrap()
    );
}

#[tauri::command]
pub fn reset_settings() -> () {
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(SETTINGS_FILE)
            .to_str()
            .unwrap(),
        &serde_json::to_string_pretty(&Settings::default()).unwrap()
    );
    reset_prefs();
    delete_all_tasks();
    set_automatic_upd(false);
}

#[tauri::command]
pub fn load_prefs() -> String {
    std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(PREFS_FILE)
            .to_str()
            .unwrap()
    ).unwrap()
}

#[tauri::command]
pub fn replace_teacher_pref(old: String, mut new: String) {
    let prefs: String = load_prefs();
    let mut parsed: PrefVariants = serde_json::from_str(&prefs).unwrap();

    println!("prefs: {}, old: {}, new: {}", prefs, old, new);

    if old.len() > 0 {
        let mut found = false;
        for i in 0..parsed.teachers.len() {
            if parsed.teachers[i] == old {
                found = true;
                std::mem::swap(&mut parsed.teachers[i], &mut new);
                break;
            };
        };
        if !found {
            parsed.teachers.push(new);
        }
    }
    else {
        parsed.teachers.push(new);
    };

    let serialization = serde_json::to_string_pretty(&parsed).unwrap();
    save_prefs(serialization);
}

#[tauri::command]
pub fn save_prefs(prefs: String) {
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(PREFS_FILE)
            .to_str()
            .unwrap(),
        prefs
    );
}

#[tauri::command]
pub fn reset_prefs() {
    let _ = std::fs::write(
        ABSOLUTE_DATA_FOLDER.join(PREFS_FILE)
            .to_str()
            .unwrap(),
        &serde_json::to_string_pretty(&PrefVariants::default()).unwrap()
    );
}

#[tauri::command]
pub fn load_windnames() -> String {
    std::fs::read_to_string(
        ABSOLUTE_DATA_FOLDER.join(WINDNAMES_FILE)
            .to_str()
            .unwrap()
    ).unwrap()
}

#[tauri::command]
pub fn open_scheduler() {
    let _ = window::create_process(
        "cmd /c taskschd", 
        CREATE_NO_WINDOW
    ); 
}

#[tauri::command]
pub fn open_link(link: String) {
    let _ = webbrowser::open(&link);
}