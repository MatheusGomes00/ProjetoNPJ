package com.npj.ProjetoNPJ.notificacoes;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "notificaoes")
@Getter
@Setter
public class NotificacoesMain {

    @Id
    private String id;

    private String advogadoId;

    private String mensagem;

    private String tarefaId;

    private boolean lida;

    private LocalDate dataCriacao;

}
