package com.npj.ProjetoNPJ.triagem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EnderecoDto {

    private String rua;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String cep;

}
