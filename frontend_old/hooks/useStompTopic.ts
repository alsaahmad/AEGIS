"use client";

import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL } from "@/lib/config";

export function useStompTopic<T = any>(
  topic: string | null,
  onMessage?: (message: T) => void,
  enabled: boolean = true,
  wsUrl: string = WS_URL
) {
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const callbackRef = useRef(onMessage);
  callbackRef.current = onMessage;

  useEffect(() => {
    if (!topic || !enabled) return;
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 2000,
      debug: () => undefined,
      onConnect: () => {
        setConnected(true);
        client.subscribe(topic, (frame: IMessage) => {
          try {
            const parsed = JSON.parse(frame.body) as T;
            setLastMessage(parsed);
            callbackRef.current?.(parsed);
          } catch {
            setLastMessage(frame.body as T);
            callbackRef.current?.(frame.body as T);
          }
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    });
    client.activate();
    return () => {
      void client.deactivate();
    };
  }, [topic, enabled, wsUrl]);

  return { connected, lastMessage };
}
