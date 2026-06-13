"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { CONFIG } from "@/lib/constants";
import { normalizeWsEvent } from "@/lib/utils";
import { WS_URL } from "@/lib/config";

type SubscriptionCallback = (data: Record<string, unknown>) => void;

export function useWebSocket(wsUrl: string = WS_URL) {
  const clientRef = useRef<Client | null>(null);
  const pendingRef = useRef<Map<string, SubscriptionCallback>>(new Map());
  const activeRef = useRef<Map<string, { callback: SubscriptionCallback; unsubscribe: () => void }>>(new Map());
  const [connected, setConnected] = useState(false);

  const parseMessage = (frame: IMessage): Record<string, unknown> => {
    try {
      const raw = JSON.parse(frame.body) as Record<string, unknown>;
      return normalizeWsEvent(raw);
    } catch {
      return { type: "RAW", body: frame.body };
    }
  };

  const resubscribeAll = useCallback((client: Client) => {
    activeRef.current.forEach(({ unsubscribe }) => unsubscribe());
    activeRef.current.clear();
    pendingRef.current.forEach((callback, topic) => {
      const sub = client.subscribe(topic, (frame) => callback(parseMessage(frame)));
      activeRef.current.set(topic, { callback, unsubscribe: () => sub.unsubscribe() });
    });
  }, []);

  const connect = useCallback(() => {
    if (clientRef.current?.active) return;
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: CONFIG.WS_RECONNECT_DELAY,
      debug: () => undefined,
      onConnect: () => {
        setConnected(true);
        resubscribeAll(client);
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    });
    clientRef.current = client;
    client.activate();
  }, [wsUrl, resubscribeAll]);

  const subscribe = useCallback(
    (topic: string, callback: SubscriptionCallback) => {
      pendingRef.current.set(topic, callback);
      if (clientRef.current?.connected) {
        const sub = clientRef.current.subscribe(topic, (frame) => callback(parseMessage(frame)));
        activeRef.current.set(topic, { callback, unsubscribe: () => sub.unsubscribe() });
      } else {
        connect();
      }
      return () => {
        pendingRef.current.delete(topic);
        const active = activeRef.current.get(topic);
        if (active) {
          active.unsubscribe();
          activeRef.current.delete(topic);
        }
      };
    },
    [connect]
  );

  const disconnect = useCallback(() => {
    activeRef.current.forEach(({ unsubscribe }) => unsubscribe());
    activeRef.current.clear();
    if (clientRef.current?.active) void clientRef.current.deactivate();
    clientRef.current = null;
    setConnected(false);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { subscribe, disconnect, connected };
}
