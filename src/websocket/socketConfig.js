import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";



/**
 * Cria e ativa conexão WebSocket STOMP com autenticação via token JWT.
 */
export function iniciarConexaoWebSocket({
    userId,
    token,
    stompClientRef,
    subscriptionRef,
    processedNotificationIds,
    isMountedRef,
    setNotificacoes,
    onError,
    }) {
    if (!userId || !token || !setNotificacoes) {
        console.warn("WS: conexão não iniciada - parâmetros inválidos");
        return;
    };

    // Evita múltiplas conexões
    if (stompClientRef.current?.connected) {
        console.log("WS: conexão já ativa, ignorando...");
        return;
    }
    
    //console.log("Iniciando conexao ws...")

    const socket = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);
    const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
        Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        //debug: (msg) => console.log("STOMP DEBUG:", msg),
    });
    
    // OnConnect: subscrever ao canal
    client.onConnect = () => {
        //console.log("WS: conectado com sucesso");
        if (!isMountedRef.current) return;

        if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        }
        
        subscriptionRef.current = client.subscribe(`/topic/notificacoes/${userId}`, (message) => {
            //console.log("WS - mensagem recebida: ", message.body)
            try {
                const novaNotificacao = JSON.parse(message.body);
                if (novaNotificacao.lida) return;
                if (!processedNotificationIds.current.has(novaNotificacao.id)) {
                processedNotificationIds.current.add(novaNotificacao.id);
                setNotificacoes((prev) => {
                    if (prev.some((n) => n.id === novaNotificacao.id)) return prev;
                    return [novaNotificacao, ...prev];
                });
                }
            } catch (error) {
                console.error("Erro ao processar mensagem WebSocket:", error);
                if (onError) onError("Erro ao processar mensagem WebSocket");
            }
        });

        stompClientRef.current = client;
    };

    client.onStompError = (frame) => {
        console.error("Erro no STOMP:", frame);
        if (onError) onError(frame.headers?.message || "Erro no WebSocket");
    };

    client.onWebSocketClose = () => {
        if (!isMountedRef.current) return;
        stompClientRef.current = null;
        subscriptionRef.current = null;
        processedNotificationIds.current.clear();
    };

    stompClientRef.current = client;
    client.activate();
}

/**
 * Desconecta o WebSocket e limpa referências.
 */
export function limparConexaoWebSocket({
  stompClientRef,
  subscriptionRef,
  processedNotificationIds,
}) {
  if (stompClientRef.current?.connected) {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    stompClientRef.current.deactivate();
  }

  stompClientRef.current = null;
  subscriptionRef.current = null;
  processedNotificationIds.current.clear();
}
