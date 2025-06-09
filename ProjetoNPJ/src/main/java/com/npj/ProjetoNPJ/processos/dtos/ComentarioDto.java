package com.npj.ProjetoNPJ.processos.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComentarioDto {

    private String id;
    private String dataModif;
    private String responsavelId;
    private String responsavelNome;
    @NotBlank(message = "Não pode ser nulo ou estar em banco!")
    private String comentarios;
}
