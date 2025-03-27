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
public class Endereco implements Serializable {

    private String rua;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String cep;
}
