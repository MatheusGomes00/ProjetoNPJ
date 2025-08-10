package com.npj.ProjetoNPJ.notificacoes;

import com.npj.ProjetoNPJ.security.JwtService;
import com.npj.ProjetoNPJ.security.UserAutenticado;
import com.npj.ProjetoNPJ.security.UserDetailsServiceImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public WebSocketConfig(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                try {
                    StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                        String token = accessor.getFirstNativeHeader("Authorization");
                        if (token == null || !token.startsWith("Bearer ")) {
                            throw new SecurityException("Token JWT ausente ou malformado.");
                        }
                        token = token.substring(7);
                        if (!jwtService.validateToken(token)) {
                            throw new SecurityException("Token JWT inválido.");
                        }
                        String userId = jwtService.extractUserId(token);
                        if (userId == null) {
                            throw new SecurityException("ID de usuário ausente no token.");
                        }
                        UserAutenticado user = (UserAutenticado) userDetailsService.loadUserById(userId);
                        if (user == null) {
                            throw new SecurityException("Usuário não encontrado.");
                        }
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                user, null, user.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        accessor.setUser(auth);
                        }
                    return message;
                } catch (ExpiredJwtException e) {
                    System.out.println("Token expirado na conexão WebSocket: " + e.getMessage());
                    return null; // Interrompe a conexão
                } catch (SecurityException | JwtException e) {
                    System.out.println("Falha de autenticação no WebSocket: " + e.getMessage());
                    return null;
                } catch (Exception e) {
                    System.out.println("Erro inesperado na autenticação WebSocket: " + e.getMessage());
                    return null;
                }
            }
        });
    }




}
