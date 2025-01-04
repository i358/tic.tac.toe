use crate::error::GatewayError;
use futures_util::{stream::SplitSink, stream::SplitStream, SinkExt, StreamExt};
use serde_json::json;
use std::sync::Arc;
use tokio::io::AsyncWriteExt;
use tokio::net::TcpStream;
use tokio::{
  sync::Mutex,
  time::{self, Duration},
};
use tokio_tungstenite::{
  connect_async, tungstenite::protocol::Message, MaybeTlsStream, WebSocketStream,
};
use url::Url;

pub struct Gateway {
  write: Arc<Mutex<SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>>>,
}

impl Gateway {
  pub async fn new(ws_uri: &Url) -> Result<Self, GatewayError> {
    let ws_stream = Self::connect(ws_uri).await?;
    let (write, read) = ws_stream.split();
    let write = Arc::new(Mutex::new(write));

    Self::spawn_read_handler(read);

    Self::spawn_ping_handler(write.clone(), ws_uri.clone());

    Ok(Self { write })
  }

  async fn connect(
    ws_uri: &Url,
  ) -> Result<WebSocketStream<MaybeTlsStream<TcpStream>>, GatewayError> {
    let mut retry_count = 0;
    loop {
      match connect_async(ws_uri.to_string()).await {
        Ok((stream, _response)) => return Ok(stream),
        Err(e) => {
          retry_count += 1;
          if retry_count > 5 {
            return Err(GatewayError::WebSocket(e));
          }
          time::sleep(Duration::from_secs(5)).await;
        }
      }
    }
  }

  fn spawn_read_handler(read: SplitStream<WebSocketStream<MaybeTlsStream<TcpStream>>>) {
    tokio::spawn(async move {
      read
        .for_each(|message| async {
          if let Ok(msg) = message {
            let data = msg.into_data();
            if let Err(e) = tokio::io::stdout().write(&data).await {
              eprintln!("Error writing to stdout: {}", e);
            }
          }
        })
        .await;
    });
  }

  fn spawn_ping_handler(
    write: Arc<Mutex<SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>>>,
    _ws_uri: Url,
  ) {
    tokio::spawn(async move {
      let mut interval = time::interval(Duration::from_secs(13));
      loop {
        interval.tick().await;
        if let Err(e) = Self::send_ping(&write).await {
          eprintln!("Ping error: {}", e);
        }
      }
    });
  }

  async fn send_ping(
    write: &Arc<Mutex<SplitSink<WebSocketStream<MaybeTlsStream<TcpStream>>, Message>>>,
  ) -> Result<(), GatewayError> {
    let mut write_lock = write.lock().await;
    write_lock
      .send(Message::Text(json!({"e":"heartbeat"}).to_string()))
      .await?;
    println!("Ping sent");
    Ok(())
  }
}
