defmodule WsWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :ws

  socket "/", WsWeb.Socket

end
