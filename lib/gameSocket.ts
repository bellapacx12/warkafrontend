let ws: WebSocket | null = null;
let listeners: ((msg: any) => void)[] = [];
let reconnectTimer: any = null;
let messageQueue: any[] = [];
let isConnecting = false;

// 🔌 CONNECT
export function connectGameWS(
  onMessage: (msg: any) => void,
  onOpen?: () => void,
) {
  // ✅ ADD listener (don't overwrite)
  if (!listeners.includes(onMessage)) {
    listeners.push(onMessage);
  }

  // ✅ already open → reuse
  if (ws && ws.readyState === WebSocket.OPEN) {
    onOpen?.();
    return;
  }

  // ✅ prevent duplicate connects
  if (isConnecting || (ws && ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  isConnecting = true;

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ No token found");
    return;
  }

  const WS_URL = `wss://warkabackend.onrender.com/ws?token=${token}`;

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log("✅ WS Connected");

    isConnecting = false;

    // flush queue
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
    } catch {
      console.error("Invalid WS message", e.data);
    }
  };

  ws.onclose = () => {
    console.log("❌ WS Disconnected");

    isConnecting = false;

    // 🔁 auto reconnect
    reconnectTimer = setTimeout(() => {
      console.log("🔁 Reconnecting...");
      connectGameWS(() => {}); // listeners already stored
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
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (ws) {
    ws.close();
    ws = null;
  }

  listeners = [];
  messageQueue = [];
  isConnecting = false;
}

// 🧹 REMOVE LISTENER
export function removeListener(cb: (msg: any) => void) {
  listeners = listeners.filter((l) => l !== cb);
}
