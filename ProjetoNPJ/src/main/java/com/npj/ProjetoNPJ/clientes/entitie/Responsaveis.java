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
@Document(collection = "responsaveis")
public class Responsaveis implements Serializable {

    @Id
    private String id;
    private String advogado;
    private String docente;
    private String estagiario1;
    private String estagiario2;
}
