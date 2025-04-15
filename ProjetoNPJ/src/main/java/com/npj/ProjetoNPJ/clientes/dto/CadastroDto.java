package com.npj.ProjetoNPJ.clientes.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CadastroDto {

    private String id;
    private String status;
    @Valid
    private ClienteDto cliente;
    //private RepresentanteDto representante;
    //private ParteContrariaDto parteContraria;
    //private DadosProcessuaisDto dadosProcessuais;
    //private NaturezaDto natureza;
   // private ResponsaveisDto responsaveis;

}
