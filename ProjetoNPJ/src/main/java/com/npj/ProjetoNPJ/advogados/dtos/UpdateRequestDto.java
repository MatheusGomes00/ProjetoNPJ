package com.npj.ProjetoNPJ.advogados.dtos;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRequestDto {

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

    private boolean status;
}