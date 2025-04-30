package com.npj.ProjetoNPJ.notificacoes.entitie;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.messaging.core.MessagePostProcessor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "notificacoes")
public class Notificacao {
   @Id
   private String id;
   private String advogadoId;
   private String mensagem;
   private LocalDateTime dataCriacao;
   private boolean lida;
}
