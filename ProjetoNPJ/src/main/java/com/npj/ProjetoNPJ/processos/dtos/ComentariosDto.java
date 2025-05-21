package com.npj.ProjetoNPJ.processos.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ComentariosDto {

    List<ComentarioDto> comentarios;

    public List<ComentarioDto> addComentario(ComentarioDto dto) {
        comentarios.add(dto);
        return comentarios;
    }
}
