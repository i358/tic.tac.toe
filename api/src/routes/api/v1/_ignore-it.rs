// use anyhow::{Result};
// use axum::{extract::{Query, State}, http::StatusCode, Json};
// use chrono::Local;
// use serde_json::{json, to_value, Value};
// use sqlx::{pool, PgPool};

// use crate::{
//   response::*,
//   structs::{message::{CreateMessage, Message, MessageRequest, ReturningMessage}, response::*},
// };

// pub async fn retrieve_messages(
//   State(pool): State<PgPool>,
// ) -> Result<(StatusCode, Json<Value>), (StatusCode, Json<Value>)> {

//   let rows: Vec<Message> = sqlx::query_as!(Message, "SELECT * FROM messages")
//     .fetch_all(&pool)
//     .await
//     .map_err(|e| {
//       (send_error(ERROR {
//         r: "An Internal Database Error occurred. Try again later.",
//         s: StatusCode::INTERNAL_SERVER_ERROR,
//       }))
//     })?;


//   let rows = to_value(&rows).unwrap();


//   Ok(send_ok(OK {
//     r: "Query succeeded.",
//     d: rows,
//     s: StatusCode::OK,
//   }))

// }

// pub async fn insert_message(
//   State(pool): State<PgPool>,
//   Json(message): Json<MessageRequest>,
// ) -> Result<(StatusCode, Json<Value>), (StatusCode, Json<Value>)> {

//   let created_at = Local::now().timestamp()*1000;

//   let msg = CreateMessage {
//     content: message.content.clone(), 
//     sender: message.sender.clone(), 
//     created_at
//   };

//   let row = sqlx::query_as!(ReturningMessage, "INSERT INTO messages (content, sender, created_at) VALUES ($1, $2, $3) RETURNING id", msg.content, msg.sender, msg.created_at)
//   .fetch_one(&pool)
//   .await
//   .map_err(|e| {
//     println!("An error occurred: {e}");
//     (send_error(ERROR {
//       r: "An Internal Database Error occurred. Try again later.",
//       s: StatusCode::INTERNAL_SERVER_ERROR,
//     }))
//   })?;


//   let data = json!({
//     "id": row.id,
//     "content": msg.content,
//     "sender": msg.sender,
//     "created_at": msg.created_at
//   });

//   let msg = to_value(&data).unwrap();

//   Ok(send_ok(OK { r: "Succeeded.", d: data, s: StatusCode::CREATED }))
  
// }