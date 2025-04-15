package com.npj.ProjetoNPJ.clientes.entitie;

import com.npj.ProjetoNPJ.clientes.dto.ClienteDto;
import com.npj.ProjetoNPJ.clientes.dto.Status;
import org.springframework.data.annotation.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cadastroCliente")
public class Cadastro {

    @Id
    private String id;
    private String status;
    private ClienteDto cliente;
    //private Representante representante;
    //private ParteContraria parteContraria;
    //private DadosProcessuais dadosProcessuais;
    //private Natureza natureza;
    //private Responsaveis responsaveis;

}
