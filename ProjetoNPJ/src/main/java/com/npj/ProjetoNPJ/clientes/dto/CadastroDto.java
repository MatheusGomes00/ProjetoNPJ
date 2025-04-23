package com.npj.ProjetoNPJ.clientes.dto;

import com.npj.ProjetoNPJ.processos.dtos.DtoProcessos;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CadastroDto {

    private String id;
    private Boolean status;

    @Valid
    @NotNull(message = "Cliente não pode estar nulo!")
    private ClienteDto cliente;
    private String nome;
    private RepresentanteDto representante;
    private ParteContrariaDto parteContraria;
    private DadosProcessuaisDto dadosProcessuais;
    private NaturezaDto natureza;
    private ResponsaveisDto responsaveis;

    private DtoProcessos processoDto;
}
