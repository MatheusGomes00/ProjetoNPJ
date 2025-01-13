package com.npj.ProjetoNPJ.triagem.dto;

import com.npj.ProjetoNPJ.triagem.entitie.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CadastroDto {

    private Boolean status;
    private Cliente cliente;
    private Representante representante;
    private ParteContraria parteContraria;
    private DadosProcessuais dadosProcessuais;
    private Natureza natureza;
    private Responsaveis responsaveis;
}
