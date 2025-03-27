package com.npj.ProjetoNPJ.triagem.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EnderecoDto {

    @NotBlank(message = "Rua não pode ser nulo ou estar em branco!")
    private String rua;

    @NotBlank(message = "Numero não pode ser nulo ou estar em branco!")
    private String numero;

    private String complemento;

    @NotBlank(message = "Bairro não pode ser nulo ou estar em branco!")
    private String bairro;

    @NotBlank(message = "Cidade não pode ser nulo ou estar em branco!")
    private String cidade;

    private String cep;

}
