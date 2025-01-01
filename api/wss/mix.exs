defmodule Wss.MixProject do
  use Mix.Project

  def project do
    [
      app: :wss,
      version: "0.1.0",
      elixir: "~> 1.17",
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
      {:plug_cowboy, "~> 2.7.2"},
      {:cowboy, "~> 2.7"}
    ]
  end

  defp aliases do
    [
      server: ["run --no-halt"]
    ]
  end
end
