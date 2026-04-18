import { useEffect, useRef, useState } from "react";

export function useLobby(token: string | null) {
  const [rooms, setRooms] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!token) return; // 🔒 don't connect without auth

    function connect() {
      const ws = new WebSocket(
        `wss://warkabackend.onrender.com/ws/lobby?token=${token}`,
      );

      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ Lobby WS connected");
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);

          if (msg.type === "rooms") {
            const sorted = msg.data.sort((a: any, b: any) => a.stake - b.stake);

            setRooms(sorted);
          }
        } catch (err) {
          console.log("Parse error:", err);
        }
      };

      ws.onclose = () => {
        console.log("❌ Lobby WS disconnected");

        // 🔁 reconnect only if token still exists
        if (token) {
          reconnectRef.current = setTimeout(() => {
            connect();
          }, 2000);
        }
      };

      ws.onerror = () => {
        ws.close(); // trigger reconnect
      };
    }

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
    };
  }, [token]); // 🔥 reconnect if token changes

  return rooms;
}
