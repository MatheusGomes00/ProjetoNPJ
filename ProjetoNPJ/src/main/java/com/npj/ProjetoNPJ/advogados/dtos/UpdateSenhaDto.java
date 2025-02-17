package com.npj.ProjetoNPJ.advogados.dtos;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSenhaDto {

    @NotBlank
    private String novaSenha;

    @NotBlank
    private String repeteSenha;
}
