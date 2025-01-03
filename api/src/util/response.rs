use axum::{http::StatusCode, Json};
use serde_json::{json, Value};

use crate::structs::response::*;

pub fn send_resp(Response { s, t, p, e }: Response) -> (StatusCode, Json<Value>) {
  (s, Json(json!({"s": s.as_u16(), "t": t, "p": p, "e": e})))
}
