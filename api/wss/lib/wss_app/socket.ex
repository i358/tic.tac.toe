defmodule WssApp.Socket do
  @behaviour :cowboy_websocket

  def init(request, _state) do
    {:cowboy_websocket, request, %{}}
  end

  def websocket_init(state) do
    {:ok, state}
  end

  def websocket_handle({:text, message}, state) do
    {:reply, {:text, "Echo: #{message}"}, state}
  end

  def websocket_info(_info, state) do
    {:ok, state}
  end

  def websocket_terminate(_reason, _req, _state) do
    :ok
  end
end
