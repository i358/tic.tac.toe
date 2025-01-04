use thiserror::Error;

#[derive(Error, Debug)]
pub enum GatewayError {
  #[error("WebSocket error: {0}")]
  WebSocket(#[from] tokio_tungstenite::tungstenite::Error),

  #[error("Connection error: {0}")]
  Connection(#[from] std::io::Error),

  #[error("Gateway already initialized")]
  AlreadyInitialized,

  #[error("Gateway not initialized")]
  NotInitialized,

  #[error("Other error: {0}")]
  Other(String),
}
