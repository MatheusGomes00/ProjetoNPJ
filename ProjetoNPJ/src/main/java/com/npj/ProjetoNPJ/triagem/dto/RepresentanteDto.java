package com.npj.ProjetoNPJ.triagem.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RepresentanteDto {

    private String nome;
    private EnderecoDto endereco;
    private String cpf;
    private String rg;
    private String ssp; // secretaria de segurança publica
    private String nascimento;
    private ContatoDto contato;
    private String estadoCivil;
    private String profissao;

}
