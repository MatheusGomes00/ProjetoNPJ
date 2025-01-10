package com.npj.ProjetoNPJ.advogados.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class advogado implements Serializable {

    @Id
    private String id;

    private String nome;

    private String datanasc;

    private String cpf;

    private String registroOab;

    private String secaoOab;
}
