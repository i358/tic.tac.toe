use crate::config::Config;
use anyhow::Result;
use axum::{extract::State, http::Method, routing::get, serve, Router};
use sqlx::{postgres::PgPoolOptions, PgPool};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower_http::cors::{Any, CorsLayer};

pub struct Server {
  pool: PgPool,
  router: Router,
  addr: SocketAddr,
}

impl Server {
  pub async fn new(config: &Config) -> Result<Self> {
    let pool = PgPoolOptions::new()
      .max_connections(80)
      .connect(&config.database_url)
      .await?;

    let cors = CorsLayer::new()
      .allow_origin(Any)
      .allow_methods(vec![Method::GET, Method::POST, Method::PUT, Method::DELETE])
      .allow_headers(Any);

    let router = Router::new()
      .route("/", get(|| async { "ok" }))
      .with_state(pool.clone())
      .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));

    Ok(Self { pool, router, addr })
  }

  pub async fn run(&self) -> Result<()> {
    let listener = TcpListener::bind(self.addr).await?;
    println!("Server running on http://{}", listener.local_addr()?);

    serve(listener, self.router.clone()).await?;
    Ok(())
  }
}
