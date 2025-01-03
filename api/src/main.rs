mod routes;
mod structs;
mod util;
use response::send_resp;
use routes::api::v1::*;
use structs::response::Response;
use util::*;

use std::{env, net::SocketAddr};

use anyhow::Result;

use axum::{
  extract::State,
  http::{Method, StatusCode, Uri},
  response::{Html, Redirect},
  routing::{get, patch, post},
  serve, Json, Router,
};
use tower_http::cors::{Any, CorsLayer};

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use sqlx::{postgres::PgPoolOptions, PgPool, Value};

use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<()> {
  match dotenvy::dotenv() {
    Ok(path) => println!("Loaded .env file from {:?}", path),
    Err(e) => (),
  }

  let port: u16 = env::var("PORT")?.parse::<u16>()?;
  let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
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

  let redirect_handler = |uri: Uri| async move {
    let target_url = "https://tictactox.online";
    Redirect::temporary(target_url)
  };

  fn test() -> Result<(StatusCode, Json<Value>), (StatusCode, Json<Value>)> {
    Ok(
      send_resp(Response { s: StatusCode::OK, t: "ok", m: "ok", e: "ok" })
    )
  }

  let index = Router::new()
    .with_state(pool)
    .route("/", get(test))
    .layer(cors);

  serve(listener, index).await?;

  Ok(())
}
