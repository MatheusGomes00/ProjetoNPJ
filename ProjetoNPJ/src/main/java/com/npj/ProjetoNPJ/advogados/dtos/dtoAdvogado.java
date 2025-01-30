package com.npj.ProjetoNPJ.advogados.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class dtoAdvogado {


    @NotNull
    private String nome;

    @NotNull
    private String datanasc;

    @NotNull
    private String cpf;

    @NotNull
    private String registroOab;

    @NotNull
    private String secaoOab;

    private boolean status;
}
