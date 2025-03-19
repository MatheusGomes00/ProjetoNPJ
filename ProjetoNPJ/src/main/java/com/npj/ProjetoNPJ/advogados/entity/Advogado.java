package com.npj.ProjetoNPJ.advogados.entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "cadastroAdvogado")
public class Advogado {

    @Id
    private String id;

    private String cpf;

    private String senha;

    private Roles role;

    private String nome;

    private String datanasc;

    private String registroOab;

    private String secaoOab;

    private Boolean status;


}
