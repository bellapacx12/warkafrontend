import { useEffect, useRef, useState } from "react";

export function useLobby() {
  const [rooms, setRooms] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket("ws://localhost:8080/ws/lobby");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ Lobby WS connected");
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);

          if (msg.type === "rooms") {
            // ✅ SORT FOR CLEAN UI
            const sorted = msg.data.sort((a: any, b: any) => a.stake - b.stake);

            setRooms(sorted);
          }
        } catch (err) {
          console.log("Parse error:", err);
        }
      };

      ws.onclose = () => {
        console.log("❌ Lobby WS disconnected");

        // 🔁 AUTO RECONNECT
        reconnectRef.current = setTimeout(() => {
          connect();
        }, 2000);
      };

      ws.onerror = () => {
        ws.close(); // force reconnect
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
  }, []);

  return rooms;
}
