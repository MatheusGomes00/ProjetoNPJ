package com.npj.ProjetoNPJ.triagem.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CadastroDto {

    private String id;
    private Boolean status;
    private ClienteDto cliente;
    private RepresentanteDto representante;
    private ParteContrariaDto parteContraria;
    private DadosProcessuaisDto dadosProcessuais;
    private NaturezaDto natureza;
    private ResponsaveisDto responsaveis;

}
