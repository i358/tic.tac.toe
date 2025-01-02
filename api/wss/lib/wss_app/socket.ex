defmodule WssApp.Socket do
  @behaviour :cowboy_websocket

  def init(request, _state) do
    {:cowboy_websocket, request, %{}}
  end

  def websocket_init(state) do
    WssApp.Util.Registry.register(self())
    send_resp(%{"e" => "server_hello", "heartbeat_interval" => 14405, "m" => "Connection Established."}, state)
  end

  def websocket_handle({:text, message}, state) do
    case WsApp.Util.Validator.validate_message(message) do
      {:ok, validated_payload} ->
        handle_valid_message(validated_payload, state)
      {:error, _} ->
        close_conn(1002, "Unsupported JSON format.", state)
    end
  end

  defp handle_valid_message(%{}=payload, state) do
   IO.puts payload["token"]
   send_resp(%{"e" => "heartbeat_ack", "m" => nil}, state)
  end

  defp send_resp(payload, state) do
    resp = Jason.encode!(payload)
    {:reply, {:text, resp}, state}
  end

  defp close_conn(op, m, state) do
    {:reply, {:close, op, m}, state}
  end

  def websocket_info({:broadcast, message}, state) do
    {:reply, {:text, "Broadcast: #{message}"}, state}
  end

  def websocket_info(info, state) do
    {:reply, {:text, "Server message: #{inspect(info)}"}, state}
  end
end
