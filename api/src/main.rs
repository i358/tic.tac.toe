

mod routes;
mod structs;
mod util;

use response::send_resp;
use routes::api::v1::*;
use structs::response::Response;
use util::*;

use std::{collections::HashMap, env, net::SocketAddr, time::Duration};

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

use sqlx::{postgres::PgPoolOptions, PgPool};

use tokio::{net::TcpListener, time};

#[tokio::main]
async fn main() -> Result<()> {
    
    match dotenvy::dotenv() {
        Ok(path) => println!("Loaded .env file from {:?}", path),
        Err(_) => (),
    }

    let port: u16 = env::var("PORT")?.parse::<u16>()?;
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let database_url = env::var("DATABASE_URL")?;
    let _static_site_url = env::var("STATIC_SITE_URL")?;
    let _gateway = env::var("GATEWAY_URI")?;
    let self_uri = env::var("GATEWAY_API_URI")?;

    
    let pool = PgPoolOptions::new()
        .max_connections(80)
        .connect(&database_url)
        .await?;

    
    let listener = TcpListener::bind(addr).await?;

    println!("Server running on http://{}", listener.local_addr()?);

    
    let ping_task = tokio::spawn(async move {
        let interval_duration = Duration::from_secs(600);
        let mut interval = time::interval(interval_duration);

        loop {
            interval.tick().await;
            if let Err(e) = ping(self_uri.clone()).await {
                eprintln!("Error occurred during ping: {:?}", e);
            }
        }
    });

    
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(vec![Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);

    
    let index = Router::new()
        .with_state(pool)
        .route("/", get(|| async { "ok" })) 
        .layer(cors);

    
    serve(listener, index).await?;

    
    if let Err(e) = ping_task.await {
        eprintln!("Ping task failed: {:?}", e);
    }

    Ok(())
}


async fn ping(self_uri: String) -> Result<()> {
    let resp = reqwest::get(self_uri + "/")
        .await?
        .text()
        .await?;
    if resp == "ok" {
        println!("Gateway API is up and running.");
    } else {
        println!("Gateway API is not running.");
    }

    Ok(())
}
