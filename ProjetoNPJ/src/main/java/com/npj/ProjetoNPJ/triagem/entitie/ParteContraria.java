package com.npj.ProjetoNPJ.triagem.entitie;

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
public class ParteContraria implements Serializable {

    private String id;
    private String nomeRazaoSocial;
    private Endereco endereco;
    private String cpfCnpj;
    private String rg;
    private String ssp;

}
