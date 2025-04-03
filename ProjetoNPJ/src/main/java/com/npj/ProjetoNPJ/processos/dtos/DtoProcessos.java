package com.npj.ProjetoNPJ.processos.dtos;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.clientes.dto.ClienteDto;
import com.npj.ProjetoNPJ.clientes.entitie.Cliente;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DtoProcessos {

    @Id
    private String id;

    private Situacao situacao;

    private String numeroProcesso;

    private String pasta;

    private String tipoAcaoClasse;

    private String requerente;

    private String representanteLegal;

    private String requerido;

    private String npjRepresentando;

    private String vara;

    private String valorCausa;

    private List<ClienteDto> cliente;

    private List<String> advogadosResponsaveis;
}
