let ws: WebSocket | null = null;

export function connectLobbyWS(onMessage: (msg: any) => void) {
  ws = new WebSocket("ws://localhost:8080/ws");

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    onMessage(msg);
  };
}
