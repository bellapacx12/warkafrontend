let ws: WebSocket | null = null;
let listeners: ((msg: any) => void)[] = [];
let reconnectTimer: any = null;
let isConnecting = false;

// queue messages if not connected yet
let messageQueue: any[] = [];

const BASE_WS_URL = "wss://warkabackend.onrender.com/ws";

// 🔌 CONNECT
export function connectGameWS(
  onMessage: (msg: any) => void,
  onOpen?: () => void,
) {
  if (!listeners.includes(onMessage)) {
    listeners.push(onMessage);
  }

  if (ws && ws.readyState === WebSocket.OPEN) {
    return;
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ No token found");
    return;
  }

  const WS_URL = `${BASE_WS_URL}?token=${token}`;

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("✅ WS Connected");
    isConnecting = false;

    // 🔥 trigger onOpen
    onOpen?.();

    // flush queue
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
    isConnecting = false;

    reconnectTimer = setTimeout(() => {
      console.log("🔁 Reconnecting...");
      connectGameWS(() => {}); // keep listeners
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

// ❌ DISCONNECT
export function disconnectWS() {
  if (ws) {
    ws.close();
    ws = null;
  }

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  listeners = [];
  messageQueue = [];
  isConnecting = false;
}
