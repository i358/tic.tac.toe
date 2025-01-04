use axum::{http::StatusCode, Json};
use serde_json::{json, Value};

use crate::{gateway::Gateway, response::send_resp, structs::response::Response};

// ? Default Handling
async fn handler() -> Result<(StatusCode, Json<Value>), (StatusCode, Json<Value>)> {
  Gateway::instance()
    .send_message(
      json!({
          "e": "some_event",
          "p": {
            "m": "hello"
          }
      })
      .to_string(),
    )
    .await
    .unwrap();

  Ok(send_resp(Response {
    s: StatusCode::OK,
    t: None,
    p: Some("value"),
    e: None,
  }))
}
