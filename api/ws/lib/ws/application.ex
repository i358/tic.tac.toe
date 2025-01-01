defmodule Ws.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [

      {DNSCluster, query: Application.get_env(:ws, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Ws.PubSub},
      {Finch, name: Ws.Finch},
      WsWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: Ws.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    WsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
