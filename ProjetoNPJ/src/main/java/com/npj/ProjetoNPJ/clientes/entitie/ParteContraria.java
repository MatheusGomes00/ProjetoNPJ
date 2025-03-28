package com.npj.ProjetoNPJ.clientes.entitie;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParteContraria implements Serializable {

    private String nomeRazaoSocial;
    private Endereco endereco;
    private String cpfCnpj;
    private String rg;
    private String ssp;

}
