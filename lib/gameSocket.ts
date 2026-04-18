let ws: WebSocket | null = null;
let listeners: ((msg: any) => void)[] = [];
let reconnectTimer: any = null;

// queue messages if not connected yet
let messageQueue: any[] = [];

const WS_URL = "wss://warkabackend.onrender.com/ws";

// 🔌 CONNECT
export function connectGameWS(onMessage: (msg: any) => void) {
  listeners.push(onMessage);

  // already connected
  if (ws && ws.readyState === WebSocket.OPEN) {
    return;
  }

  // prevent duplicate reconnect loops
  if (ws && ws.readyState === WebSocket.CONNECTING) {
    return;
  }

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("✅ WS Connected");

    // flush queued messages
    messageQueue.forEach((msg) => {
      ws?.send(JSON.stringify(msg));
    });
    messageQueue = [];
  };

  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);

      listeners.forEach((cb) => cb(msg));
    } catch (err) {
      console.error("Invalid WS message", e.data);
    }
  };

  ws.onclose = () => {
    console.log("❌ WS Disconnected");

    // auto reconnect
    reconnectTimer = setTimeout(() => {
      console.log("🔁 Reconnecting...");
      connectGameWS(() => {});
    }, 2000);
  };

  ws.onerror = (err) => {
    console.log("⚠️ WS Error", err);
  };
}

// 📤 SEND
export function sendWS(data: any) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  } else {
    console.log("⏳ WS not ready, queueing...");
    messageQueue.push(data);
  }
}

// ❌ DISCONNECT (optional)
export function disconnectWS() {
  if (ws) {
    ws.close();
    ws = null;
  }

  listeners = [];
  messageQueue = [];
}
