defmodule Wss.Application do
  use Application

  def start(_type, _args) do
    children = [
      {Registry, keys: :duplicate, name: WssApp.Util.Registry},
      {Plug.Cowboy, scheme: :http, plug: nil, options: [
        port: 1000,
        dispatch: dispatch()
      ]}
    ]

    opts = [strategy: :one_for_one, name: Wss.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_, [
        {"/ws", WssApp.Socket, []}
      ]}
    ]
  end
end
