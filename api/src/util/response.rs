use axum::{http::StatusCode, Json};
use serde_json::{json, Value};

use crate::structs::response::*;

pub fn send_resp(Response { s, t, m, e }: Response) -> (StatusCode, Json<Value>) {
  (s, Json(json!({"t": t, "m": m, "e": e})))
}
