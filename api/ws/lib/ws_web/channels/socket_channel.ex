defmodule WsWeb.SocketChannel do
  use Phoenix.Channel

  def join("socket", _message, socket) do
    {:ok, socket}
  end

  def handle_in("handshake", %{"token" => token, "payload" => payload}, socket) do
   IO.puts token
  end

  def handle_in("echo", %{"content" => content}, socket) do
    broadcast(socket, "echo_server", %{"content"=>content})
    {:noreply, socket}
  end

end
