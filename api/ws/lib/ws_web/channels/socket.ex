defmodule WsWeb.Socket do
  use Phoenix.Socket

  channel "socket", WsWeb.SocketChannel

  def connect(_params, socket, _connect_info) do
    IO.puts "A client connected."
    {:ok, socket}
  end

  def id(_socket), do: nil
end
