import Config

config :ws, WsWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "FOuZIqq2XSarN9SJlE6wnvI52pQm2AOPSxhQcPLnVgeOz/mVXJsftOVPK+aUy21V",
  server: false

config :ws, Ws.Mailer, adapter: Swoosh.Adapters.Test

config :swoosh, :api_client, false

config :logger, level: :warning

config :phoenix, :plug_init_mode, :runtime
