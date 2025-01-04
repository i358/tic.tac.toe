mod config;
mod util;
mod structs;
use server::Server;
use util::*;

use anyhow::Result;
use config::Config;
use gateway::Gateway;

#[tokio::main]
async fn main() -> Result<()> {
  let config = Config::new()?;
  println!("Configuration loaded");

  let _gateway = Gateway::new(&config.gateway_uri).await?;
  println!("Gateway initialized");

  let server = Server::new(&config).await?;
  server.run().await?;

  Ok(())
}
