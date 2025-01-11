package com.npj.ProjetoNPJ.triagem.dto;

import com.npj.ProjetoNPJ.triagem.entitie.Cliente;
import com.npj.ProjetoNPJ.triagem.entitie.Responsaveis;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CadastroDto {

    private ClienteDto cliente;
    private RepresentanteDto representante;
    private ParteContrariaDto parteContra;
    private ResponsaveisDto responsaveis;

}
