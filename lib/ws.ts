let ws: WebSocket | null = null;

export function connectLobbyWS(onMessage: (msg: any) => void) {
  ws = new WebSocket("wss://warkabackend.onrender.com/ws");

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    onMessage(msg);
  };
}
