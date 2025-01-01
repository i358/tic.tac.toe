defmodule WssApp.Socket do
  @behaviour :cowboy_websocket

  def init(request, _state) do
    {:cowboy_websocket, request, %{}}
  end

  def websocket_init(state) do
    WssApp.Util.Registry.register(self())
    {:reply, {:text, Jason.encode!(%{"e" => "server_hello", "heartbeat_interval" => 4800, "m" => "Connection Established."})}, state}
  end

  def websocket_handle({:text, message}, state) do
    case WsApp.Util.Validator.validate_message(message) do
      {:ok, validated_payload} ->
        handle_valid_message(validated_payload, state)

      {:error, error_response} ->
        {:reply, {:text, Jason.encode!(error_response)}, state}
    end
  end

  defp handle_valid_message(%{}, state) do
    {:reply, {:text, "OK"}, state}
  end

  def websocket_info({:broadcast, message}, state) do
    {:reply, {:text, "Broadcast: #{message}"}, state}
  end

  def websocket_info(info, state) do
    {:reply, {:text, "Server message: #{inspect(info)}"}, state}
  end
end
