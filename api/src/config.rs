use anyhow::Result;
use std::env;
use url::Url;

pub struct Config {
  pub port: u16,
  pub database_url: String,
  pub static_site_url: String,
  pub gateway_uri: Url,
  pub self_uri: String,
}

impl Config {
  pub fn new() -> Result<Self> {
    match dotenvy::dotenv() {
      Ok(path) => println!("Loaded .env file from {:?}", path),
      Err(_) => (),
    }

    Ok(Config {
      port: env::var("PORT")?.parse()?,
      database_url: env::var("DATABASE_URL")?,
      static_site_url: env::var("STATIC_SITE_URL")?,
      gateway_uri: Url::parse(&env::var("GATEWAY_URI")?)?,
      self_uri: env::var("GATEWAY_API_URI")?,
    })
  }
}
