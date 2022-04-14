use clap::Parser;

#[derive(clap::Parser, Debug, Clone)]
#[clap(author, version, about, long_about = None)]
pub struct WatchArgs {
    #[clap(short, long)]
    pub name: String,
    #[clap(short, long)]
    pub start: String,
    #[clap(short, long)]
    pub end: String,
    #[clap(short, long)]
    pub id: String,
    #[clap(short, long)]
    pub pwd: Option<String>,
    #[clap(short, long, min_values(0))]
    pub watchonly: bool
}
impl WatchArgs {
    pub fn new(
        name: String, 
        start: String, 
        end: String, 
        id: String, 
        pwd: Option<String>,
        watchonly: bool
    ) -> Self {
        Self {
            name,
            start,
            end,
            id,
            pwd,
            watchonly
        }
    }
    pub fn stringify(&self) -> String {
        let mut args = "--name ".to_string();
        args.push_str(&format!("\"{}\"", &self.name));
        args.push_str(" --start ");
        args.push_str(&self.start);
        args.push_str(" --end ");
        args.push_str(&self.end);
        args.push_str(" --id ");
        args.push_str(&self.id);
        if self.pwd.is_some() {
            args.push_str(" --pwd ");
            args.push_str(self.pwd.as_ref().unwrap());
        }
        if self.watchonly {
            args.push_str(" --watchonly ");
        }
        args
    }
}

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub struct ClientArgs {
    #[clap(short, long)]
    pub state: Option<String>,
    #[clap(short, long, min_values(0))]
    pub update: bool
}

impl ClientArgs {
    pub fn new(state: Option<String>, update: bool) -> Self {
        Self {
            state,
            update
        }
    }
    pub fn stringify(&self) -> String {
        let mut args = "--state ".to_string();
        if self.state.is_some() {
            args.push_str(self.state.as_ref().unwrap());
        }

        if self.update {
            args.push_str("--update");
        }

        args
    }
}
