package com.npj.ProjetoNPJ.clientes.entitie;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "contato")
public class Contato implements Serializable {

    @Id
    private String id;
    private List<String> numeros;
    private String email;
}
