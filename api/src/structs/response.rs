use axum::http::StatusCode;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ReturningResponse {
    pub id: i32
}
pub struct Response {
  pub s: StatusCode,
  pub t: Option<&'static str>,
  pub p: Option<&'static str>,
  pub e: Option<&'static str>
}
