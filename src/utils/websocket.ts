import {WebSocketURI} from '../config/web.json'

class WebSocketManager {
    private static instance: WebSocketManager;
    private ws: WebSocket | null = null;
    private ping: ReturnType<typeof setInterval> | null = null;
    private timeout: number = 0;
    private tryReconnect: ReturnType<typeof setInterval> | null = null;
    private eventListeners: Map<string, Function[]> = new Map();
  
    private constructor() {
      this.connect();
    }
  
    public static getInstance(): WebSocketManager {
      if (!WebSocketManager.instance) {
        WebSocketManager.instance = new WebSocketManager();
      }
      return WebSocketManager.instance;
    }
  
    private connect(): void {
      this.ws = new WebSocket(WebSocketURI);
      this.clearReconnectInterval();
  
      this.ws.onopen = () => {
        if (this.timeout > 0) {
          this.startPing();
        }
        this.emit("connect", {});
      };
  
      this.ws.onmessage = this.handleMessage.bind(this);
  
      this.ws.onclose = this.handleClose.bind(this);
    }
  
    private startPing(): void {
      this.ping = setInterval(() => {
        this.ws?.send(JSON.stringify({ e: "heartbeat" }));
        console.log("sent ping");
      }, this.timeout);
    }
  
    private stopPing(): void {
      if (this.ping) {
        clearInterval(this.ping);
        this.ping = null;
      }
    }
  
    private startReconnectInterval(): void {
      this.tryReconnect = setInterval(() => {
        this.connect();
      }, 5800);
    }
  
    private clearReconnectInterval(): void {
      if (this.tryReconnect) {
        clearInterval(this.tryReconnect);
        this.tryReconnect = null;
      }
    }
  
    public getWebSocket(): WebSocket | null {
      return this.ws;
    }
  
    public on(event: string, listener: Function): void {
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, []);
      }
      this.eventListeners.get(event)?.push(listener);
    }
  
    public emit(event: string, data: any): void {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.forEach((listener) => listener(data));
      }
    }
  
    private handleMessage(message: MessageEvent): void {
      const data = JSON.parse(message.data);
      if (data["e"] === "server_hello") {
        console.log("WebSocket connection established");
        this.timeout = data["heartbeat_interval"];
        this.emit("connect", data);
      } else {
        this.emit("message", data);
      }
      console.log(data);
    }
  
    private handleClose(event: CloseEvent): void {
      this.stopPing();
      console.log("WebSocket connection closed", event.code, event.reason);
      this.emit("disconnect", event);
      this.startReconnectInterval();
    }
  }
  
  export const WS = WebSocketManager.getInstance();
  