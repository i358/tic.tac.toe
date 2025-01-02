defmodule Wss.MixProject do
  use Mix.Project

  def project do
    [
      app: :websocket_server,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {Wss.Application, []}
    ]
  end

  defp deps do
    [
      {:cowboy, "~> 2.9"},
      {:plug, "~> 1.13"},
      {:plug_cowboy, "~> 2.5"},
      {:jason, "~> 1.4"}  
    ]
  end

  defp aliases do
    [
      server: ["deps.get", "run --no-halt"]
    ]
  end
end
