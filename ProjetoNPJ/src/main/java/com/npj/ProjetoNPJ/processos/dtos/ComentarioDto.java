package com.npj.ProjetoNPJ.processos.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioDto {

    private String dataModif;
    private String responsavelId;
    private String responsavelNome;
    private String comentarios;
}
