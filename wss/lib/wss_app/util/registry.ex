defmodule WssApp.Util.Registry do
  def start_link do
    Registry.start_link(keys: :duplicate, name: __MODULE__)
  end

  def register(client_id) do
    Registry.register(__MODULE__, "clients", client_id)
  end

  def broadcast(message) do
    Registry.dispatch(__MODULE__, "clients", fn entries ->
      for {pid, _} <- entries do
        Process.send(pid, {:broadcast, message}, [])
      end
    end)
  end
end