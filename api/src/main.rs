mod config;
mod util;
mod structs;
use server::Server;
use util::*;
use url::Url;
mod routes;
use anyhow::Result;
use config::Config;
use gateway::Gateway;

#[tokio::main]
async fn main() -> Result<()> {
  let config = Config::new()?;
  println!("Configuration loaded");
  
  let gateway_uri = config.gateway_uri.as_str();
  let ws_uri = Url::parse(&gateway_uri)?;

  Gateway::initialize(&ws_uri).await?;

  println!("Gateway initialized");

  let server = Server::new(&config).await?;
  server.run().await?;

  Ok(())
}
