package com.npj.ProjetoNPJ.clientes.entitie;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cliente")
public class Cliente implements Serializable {

    @Id
    private String id;
    private String nome;
    private String cpf;
    private String rg;
    private String nascimento;
    private Endereco endereco;
    private Contato contato;
    private Boolean casaPropria;
    private Boolean status;

}
