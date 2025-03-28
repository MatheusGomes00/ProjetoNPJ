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
public class Representante implements Serializable {

    private String nome;
    private Endereco endereco;
    private String cpf;
    private String rg;
    private String ssp; // secretaria de segurança publica
    private String nascimento;
    private Contato contato;
    private String estadoCivil;
    private String profissao;

}
