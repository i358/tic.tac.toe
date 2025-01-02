defmodule WsApp.Util.Validator do
  def validate_message(message) do
    case Jason.decode(message) do
      {:ok, payload} -> validate_payload(payload)
      {:error, _} -> create_error(["Invalid JSON format"])
    end
  end

  defp validate_payload(%{"e"=>e}=payload)
    when is_binary(e) do
    {:ok, payload}
  end

  defp validate_payload(payload) do
    errors = []
    |> check_event_exists(payload)
    |> check_payload_exists(payload)
    |> check_event_type(payload)

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
    if not Map.has_key?(payload, "e"), do: ["Missing event field" | errors], else: errors
  end

  defp check_payload_exists(errors, payload) do
    if not Map.has_key?(payload, "m"), do: ["Missing payload field" | errors], else: errors
  end

  defp check_event_type(errors, %{"e" => event}) do
    if not is_binary(event), do: ["Event must be a string" | errors], else: errors
  end

  defp check_event_type(errors, _), do: errors
end
