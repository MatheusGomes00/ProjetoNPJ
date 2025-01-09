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
@Document(collection = "endereco")
public class Endereco implements Serializable {

    @Id
    private String id;
    private String rua;
    private String bairro;
    private String numero;
    private String complemento;
    private String cidade;
    private String cep;

}
