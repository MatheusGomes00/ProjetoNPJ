package com.npj.ProjetoNPJ.advogados.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DtoAdvogado {


    @NotBlank
    private String nome;

    @NotBlank
    private String datanasc;

    @NotBlank
    private String cpf;

    @NotBlank
    private String registroOab;

    @NotBlank
    private String secaoOab;

    @NotBlank
    private String senha;

    @NotBlank
    private String role;

    private boolean status;
}
