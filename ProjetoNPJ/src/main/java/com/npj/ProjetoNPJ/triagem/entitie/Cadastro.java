package com.npj.ProjetoNPJ.triagem.entitie;

import org.springframework.data.annotation.Id;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cadastroCliente")
public class Cadastro {

    @Id
    private String id;
    private Boolean status;
    @DBRef
    private Cliente cliente;
    @DBRef
    private Representante representante;
    @DBRef
    private ParteContraria parteContraria;
    @DBRef
    private DadosProcessuais dadosProcessuais;
    @DBRef
    private Natureza natureza;
    @DBRef
    private Responsaveis responsaveis;

}
