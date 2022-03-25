use windows::{
    Win32::Foundation::{
        BSTR,
        GetLastError
    },
    Win32::System::{
        Com::{
            VARIANT,
            COINIT_MULTITHREADED,
            CLSCTX_ALL,
            CoCreateInstance,
            CoInitializeEx
        },
        TaskScheduler::{
            TaskScheduler,
            TASK_CREATE_OR_UPDATE,
            TASK_LOGON_INTERACTIVE_TOKEN,
            TASK_ACTION_EXEC,
            TASK_TRIGGER_TIME,
            IAction,
            IExecAction,
            ITimeTrigger,
            ITaskFolder,
            ITaskService,
            ITaskDefinition,
            ITriggerCollection,
            IRegistrationInfo,
            IActionCollection,
            ITaskSettings, 
        }
    }, core::Interface
};


type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;
pub struct Scheduler {
    pub name: Option<&'static str>,
    pub folder: Option<ITaskFolder>,
    service: ITaskService,
    def: ITaskDefinition,
    triggers: ITriggerCollection,
    actions: IActionCollection,
    reginfo: IRegistrationInfo,
    settings: ITaskSettings,
}

impl Scheduler {
    pub fn new() -> Result<Self> {
        unsafe {
            CoInitializeEx(std::ptr::null_mut(), COINIT_MULTITHREADED)?;
            let service: ITaskService = CoCreateInstance(
                &TaskScheduler, 
                None, 
                CLSCTX_ALL
            )?;
            service.Connect(
                VARIANT::default(),
                VARIANT::default(),
                VARIANT::default(),
                VARIANT::default()
            )?;
            let def: ITaskDefinition = service.NewTask(0)?;
            let triggers: ITriggerCollection = def.Triggers()?;
            let actions: IActionCollection = def.Actions()?;
            let reginfo: IRegistrationInfo = def.RegistrationInfo()?;
            let settings: ITaskSettings = def.Settings()?;

            println!("{:?}", GetLastError());

        Ok(Self {
            name: None,
            folder: None,
            service,
            def,
            triggers,
            actions,
            reginfo,
            settings
        })
        }
    }

    pub fn name(mut self, name: &'static str) -> Result<Self> {
        self.name = Some(name);
        Ok(self)
    }

    pub fn folder(mut self, path: &str) -> Result<Self> {
        self.folder = unsafe {
            Some(self.service.GetFolder(BSTR::from(path))?)
        };
        Ok(self)
    }

    pub fn action(
        self,
        path: &str,
        argument: &str,
        workingdirectory: &str
    ) -> Result<Self> {
        unsafe {
            let action: IAction = self.actions.Create(TASK_ACTION_EXEC)?;
            let exec: IExecAction = action.cast()?;

            exec.SetPath(path)?;
            exec.SetArguments(argument)?;
            exec.SetWorkingDirectory(workingdirectory)?;
        }
        Ok(self)
    }

    pub fn time_trigger(
        self,
        start: &str,
        end: Option<&str>,
        timelimit: Option<&str>
    ) -> Result<Self> {
        unsafe {
            let trigger = self.triggers.Create(TASK_TRIGGER_TIME)?;
            let time: ITimeTrigger = trigger.cast::<ITimeTrigger>()?;

            // 2005-10-11T13:21:17-08:00
            // YYYY-MM-DDTHH:MM:SS(+-)HH:MM
            // The (+-)HH:MM section of the format describes 
            // the time zone as a certain number of hours ahead 
            // or behind Coordinated Universal Time (Greenwich Mean Time).
            time.SetStartBoundary(start)?;
            if !end.is_none() {time.SetEndBoundary(end.unwrap())?};

            // The format for this string is PnYnMnDTnHnMnS, 
            // where nY is the number of years, 
            // nM is the number of months, 
            // nD is the number of days, 
            // 'T' is the date/time separator, 
            // nH is the number of hours, 
            // nM is the number of minutes, 
            // and nS is the number of seconds 
            // (for example, PT5M specifies 5 minutes 
            // and P1M4DT2H5M specifies one month, 
            // four days, two hours, and five minutes).
            if !timelimit.is_none() {
                time.SetExecutionTimeLimit(timelimit.unwrap())?
            };

            time.SetEnabled(1)?;

        }
        Ok(self)
    }

    pub fn register(self) -> Result<()> {
        unsafe {
            self.folder.unwrap().RegisterTaskDefinition(
                BSTR::from(self.name.unwrap()), 
                self.def, 
                TASK_CREATE_OR_UPDATE.0, 
                None, 
                None, 
                TASK_LOGON_INTERACTIVE_TOKEN, 
                None
            )?;
            self.settings.SetEnabled(1)?;
        }
        Ok(())
    }
}