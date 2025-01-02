use axum::http::StatusCode;
use serde_json::Value;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ReturningResponse {
    pub id: i32
}
pub struct Response {
  pub s: StatusCode,
  pub t: &'static str,
  pub m: &'static str,
  pub e: &'static str
}
