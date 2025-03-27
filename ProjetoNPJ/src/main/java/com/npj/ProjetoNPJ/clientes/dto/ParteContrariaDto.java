package com.npj.ProjetoNPJ.clientes.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ParteContrariaDto {

    private String nomeRazaoSocial;
    private EnderecoDto endereco;
    private String cpfCnpj;
    private String rg;
    private String ssp;
    
}
