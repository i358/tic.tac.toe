defmodule WssApp.Socket do
  @behaviour :cowboy_websocket

  def init(request, _state) do
    {:cowboy_websocket, request, %{client_id: generate_client_id()}}
  end

  def websocket_init(state) do
    WssApp.Util.Registry.broadcast("Client #{state.client_id} connected.")
    WssApp.Util.Registry.register(state.client_id)
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

  defp handle_valid_message(%{"e" => e} = _payload, state) do
    case e do
      "heartbeat" ->
        send_resp(%{"e" => "heartbeat_ack", "m" => nil}, state)

      _ ->
        close_conn(1003, "Unsupported Event type", state)
    end
  end

  defp send_resp(payload, state) do
    resp = Jason.encode!(payload)
    {:reply, {:text, resp}, state}
  end

  defp close_conn(op, m, state) do
    {:reply, {:close, op, m}, state}
  end

  def websocket_info({:broadcast, message}, state) do
    send_resp(%{"e"=>"broadcast", "m"=>message}, state)
  end

  defp generate_client_id do
    :crypto.strong_rand_bytes(8) |> Base.url_encode64()
  end
end