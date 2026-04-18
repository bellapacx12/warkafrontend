let ws: WebSocket | null = null;
let listeners: ((msg: any) => void)[] = [];
let reconnectTimer: any = null;
let messageQueue: any[] = [];

// ❌ remove static URL
// const WS_URL = "wss://warkabackend.onrender.com/ws";

// 🔌 CONNECT
export function connectGameWS(
  onMessage: (msg: any) => void,
  onOpen?: () => void,
) {
  listeners = [onMessage];

  if (ws && ws.readyState === WebSocket.OPEN) {
    onOpen?.();
    return;
  }

  if (ws && ws.readyState === WebSocket.CONNECTING) return;

  // 🔥 GET TOKEN
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ No token found, cannot connect WS");
    return;
  }

  console.log("🔐 Using token:", token);

  // 🔥 ATTACH TOKEN HERE
  const WS_URL = `wss://warkabackend.onrender.com/ws?token=${token}`;

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("✅ WS Connected");

    messageQueue.forEach((msg) => {
      ws?.send(JSON.stringify(msg));
    });
    messageQueue = [];

    onOpen?.();
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

    reconnectTimer = setTimeout(() => {
      console.log("🔁 Reconnecting...");
      connectGameWS(onMessage, onOpen);
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
    messageQueue.push(data);
  }
}

// ❌ DISCONNECT
export function disconnectWS() {
  if (reconnectTimer) clearTimeout(reconnectTimer);

  ws?.close();
  ws = null;

  listeners = [];
  messageQueue = [];
}
