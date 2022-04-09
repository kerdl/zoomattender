use clap::Parser;

#[derive(clap::Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub struct WatchArgs {
    #[clap(short, long)]
    pub start: String,
    #[clap(short, long)]
    pub end: String,
    #[clap(short, long)]
    pub id: String,
    #[clap(short, long)]
    pub pwd: Option<String>,
}

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub struct ClientArgs {
    #[clap(short, long, min_values(0))]
    pub update: bool,
}
