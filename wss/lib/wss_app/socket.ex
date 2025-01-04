defmodule WssApp.Socket do
  @behaviour :cowboy_websocket
  alias WssApp.Util.Registry, as: Registry

  def init(request, _state) do
    {:cowboy_websocket, request, %{client_id: generate_client_id()}}
  end

  def websocket_init(state) do
    Registry.unregister_client(state.client_id)
    # Registry.broadcast(%{
    #   "e" => "wss:join",
    #   "m" => "##{state.client_id} has joined.",
    #   "p" => %{"u" => state.client_id},
    #   "t" => "wss"
    # })
    # Registry.register(state.client_id)
    # TODO ^ Add Auth Middleware

    IO.puts("Client #{state.client_id} connected. Waiting for authentication")
    # close_conn(1013, "Socket gateway deprecated until new version is available", state)
    send_resp(
      %{"e" => "server_hello", "t" => nil, "heartbeat_interval" => 14405, "m" => "Connection Established."},
      state
    )
  end

  def websocket_handle({:text, message}, state) do
    case WsApp.Util.Validator.validate_message(message) do
      {:ok, validated_payload} ->
        handle_valid_message(validated_payload, state)

      {:error, _} ->
        close_conn(1002, "Unsupported JSON format.", state)
    end
  end

  def websocket_info({:broadcast, message}, state) do
    {:reply, {:text, message}, state}
  end

  def terminate(_reason, _req, state) do
    IO.puts("Client #{state.client_id} disconnected.")
    # Registry.unregister_client(state.client_id)

    # Registry.broadcast(%{
    #   "e" => "wss:left",
    #   "m" => "##{state.client_id} has left.",
    #   "p" => %{"u" => state.client_id},
    #   "t" => "wss"
    # })
    # TODO ^ Add Auth Middleware
  end

  defp handle_valid_message(%{"e" => e} = payload, state) do
    case e do
      "heartbeat" ->
        send_resp(%{"e" => "heartbeat_ack", "t" => "wss"}, state)

      _ ->
        case String.split(e, ":", parts: 2) do
          [protocol, event] ->
            case protocol do
              "game" ->
                case event do
                  "pressed" ->
                    s = payload["p"]["s"]
                    u = payload["p"]["u"]
                    if !s or !u or !is_number(s) do
                      close_conn(1007, "Unsupported data type or missing \"s\" or \"u\" frame for \"pressed\" event", state)
                    else
                      Registry.broadcast(%{
                        "e" => "wss:pressed",
                        "p" => %{
                          "s" => s,
                          "u" => u
                        },
                        "t" => "game"
                      })
                      send_resp(%{"e"=>"wss:ack", "t"=>"game"}, state)
                    end
                  _ ->
                    close_conn(1002, "Unsupported event", state)
                end

              "auth" ->
                case event do
                  _ -> close_conn(1002, "Unsupported event", state)
                end
              # "test" ->
              #   case event do
              #     "message" ->
              #       m = payload["p"]["m"]
              #       if(!m) do
              #       close_conn(1002, "Missing \"m\" frame for \"message\" event", state)
              #       else
              #       Registry.broadcast(%{"e"=>"wss:message", "p"=>%{"m"=>m}})
              #       send_resp(%{"e"=>"wss:ack", "t"=>"message", "m"=>"OK"}, state)
              #       end
              #     _ -> close_conn(1002, "Unsupported event", state)
              #   end
              # ? ^ Uncomment only for testing
              _ ->
                close_conn(1002, "Unsupported protocol", state)
            end

          _ ->
            close_conn(1007, "Missing Event protocol", state)
        end
    end
  end

  defp send_resp(payload, state) do
    resp = Jason.encode!(payload)
    {:reply, {:text, resp}, state}
  end

  defp close_conn(op, m, state) do
    {:reply, {:close, op, m}, state}
  end

  defp generate_client_id do
    :crypto.strong_rand_bytes(8) |> Base.encode16
  end
end
