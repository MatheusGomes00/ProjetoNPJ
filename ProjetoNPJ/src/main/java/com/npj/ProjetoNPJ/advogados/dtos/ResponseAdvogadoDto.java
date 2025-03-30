package com.npj.ProjetoNPJ.advogados.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ResponseAdvogadoDto {

    private String id;

    private String nome;

    private String datanasc;

    private String cpf;

    private String registroOab;

    private String secaoOab;

    private boolean status;

    private String role;
}
