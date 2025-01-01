import Config

config :ws,
  generators: [timestamp_type: :utc_datetime]

config :ws, WsWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  pubsub_server: Ws.PubSub,
  live_view: [signing_salt: "TQ9LN/Um"]

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id], level: :error


config :phoenix, :json_library, Jason

import_config "#{config_env()}.exs"
