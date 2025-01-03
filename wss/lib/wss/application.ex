defmodule Wss.Application do
  use Application

  def start(_type, _args) do
    children = [
      {Registry, keys: :duplicate, name: WssApp.Util.Registry},
      {Plug.Cowboy, scheme: :http, plug: nil, options: [
        port: 10000,
        dispatch: dispatch()
      ]}
    ]

    opts = [strategy: :one_for_one, name: Wss.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_, [
        {"/", WssApp.Socket, []}
      ]}
    ]
  end
end
