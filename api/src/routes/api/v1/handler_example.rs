use axum::{http::StatusCode, Json};
use serde_json::Value;

use crate::{response::send_resp, structs::response::Response};



// ? Default Handling
async fn handler() -> Result<(StatusCode, Json<Value>), (StatusCode, Json<Value>)> {
    Ok(
      send_resp(Response { s: StatusCode::OK, t: None, p: Some("value"), e: None })
    )
  } 