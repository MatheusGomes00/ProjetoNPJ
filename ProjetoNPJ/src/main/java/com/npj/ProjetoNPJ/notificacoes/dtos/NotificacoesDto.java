package com.npj.ProjetoNPJ.notificacoes.dtos;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NotificacoesDto {

    @Id
    private String id;

    private String advogadoId;

    private String mensagem;

    private String tarefaId;

    private boolean lida;

    private LocalDate dataCriacao;

}


