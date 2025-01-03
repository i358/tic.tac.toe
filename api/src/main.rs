#![allow(unused)]

mod routes;
mod structs;
mod util;
use routes::api::v1::*;
use util::*;

use std::{env, net::SocketAddr};

use anyhow::Result;

use axum::{
  extract::{State},
  http::{Method, StatusCode},
  response::Html,
  routing::{get, patch, post},
  serve, Json, Router,
};
use tower_http::cors::{Any, CorsLayer};

use serde::{Deserialize, Serialize};
use serde_json::json;

use sqlx::{postgres::PgPoolOptions, PgPool};

use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<()> {


  let port: u16 = env::var("PORT")?.parse::<u16>()?;
  let addr = SocketAddr::from(([0, 0, 0, 0], port));
  let database_url = env::var("DATABASE_URL")?;

  let pool = PgPoolOptions::new()
    .max_connections(80)
    .connect(&database_url)
    .await?;

  let listener = TcpListener::bind(addr).await?;

  println!("Server running on http://{}", listener.local_addr()?);

  let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(vec![Method::GET, Method::POST, Method::PUT, Method::DELETE])
    .allow_headers(Any);

  let index = Router::new()
    .with_state(pool)
    .layer(cors);


  serve(listener, index).await?;

  Ok(())

}
