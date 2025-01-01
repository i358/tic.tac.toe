defmodule WsApp.Util.Validator do
  def validate_message(message) do
    case Jason.decode(message) do
      {:ok, payload} -> validate_payload(payload)
      {:error, _} -> create_error(["Invalid JSON format"])
    end
  end

  defp validate_payload(%{"event" => "ping"}) do
    {:ok, %{event: "ping", token: nil, payload: nil}}
  end

  defp validate_payload(%{"event" => event, "token" => token, "payload" => payload})
    when is_binary(event) and is_binary(token) do
    {:ok, %{event: event, token: token, payload: payload}}
  end

  defp validate_payload(payload) do
    errors = []
    |> check_event_exists(payload)
    |> check_event_type(payload)
    |> check_required_fields(payload)

    if length(errors) > 0 do
      create_error(errors)
    else
      {:error, create_error(["Malformed payload"])}
    end
  end

  defp create_error(descriptions) when is_list(descriptions) do
    {:error, %{
      errors: Enum.map(descriptions, fn desc -> %{description: desc} end)
    }}
  end

  defp check_event_exists(errors, payload) do
    if not Map.has_key?(payload, "event"), do: ["Missing event field" | errors], else: errors
  end

  defp check_event_type(errors, %{"event" => event}) do
    if not is_binary(event), do: ["Event must be a string" | errors], else: errors
  end
  defp check_event_type(errors, _), do: errors
  defp check_required_fields(errors, %{"event" => "ping"}), do: errors
  defp check_required_fields(errors, payload) do
    errors
    |> check_token_exists(payload)
    |> check_payload_exists(payload)
    |> check_token_type(payload)
  end

  defp check_token_exists(errors, payload) do
    if not Map.has_key?(payload, "token"), do: ["Missing token field" | errors], else: errors
  end

  defp check_payload_exists(errors, payload) do
    if not Map.has_key?(payload, "payload"), do: ["Missing payload field" | errors], else: errors
  end

  defp check_token_type(errors, %{"token" => token}) do
    if not is_binary(token), do: ["Token must be a string" | errors], else: errors
  end
  defp check_token_type(errors, _), do: errors
end
