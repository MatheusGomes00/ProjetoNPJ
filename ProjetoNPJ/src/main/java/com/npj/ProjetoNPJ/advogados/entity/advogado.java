package com.npj.ProjetoNPJ.advogados.entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cadastroAdvogado")
public class advogado implements Serializable {

    @Id
    private String id;

    private String nome;

    private String datanasc;

    private String cpf;

    private String registroOab;

    private String secaoOab;

    public boolean isStatus() {
        return status;
    }

    public boolean setStatus(boolean status) {
        this.status = status;
        return status;
    }

    private boolean status;
}
