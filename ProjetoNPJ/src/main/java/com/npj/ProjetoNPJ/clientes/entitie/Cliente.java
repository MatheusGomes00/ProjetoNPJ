package com.npj.ProjetoNPJ.triagem.entitie;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    private String nome;
    private Endereco endereco;
    private String cpf;
    private String rg;
    private String ssp; // secretaria de segurança publica
    private String nascimento;
    private Contato contato;
    private Boolean casaPropria;

}
