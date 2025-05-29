package com.npj.ProjetoNPJ.processos.entity;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
import com.npj.ProjetoNPJ.processos.dtos.ComentarioDto;
import com.npj.ProjetoNPJ.processos.dtos.Situacao;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@ToString
@Document(collection = "cadastradoProcessos")
public class Processos {

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

    private List<ComentarioDto> listaComentarios;

    @DBRef(lazy = false)
    private List<Advogado> responsaveis;

    private List<String> responsaveisNome;

    @DBRef(lazy = false)
    private List<Cadastro> cliente;

    @NotEmpty
    private List<String> clienteNome;

    public Processos() {
        this.listaComentarios = new ArrayList<>();
    }

    public void addComentario(ComentarioDto comentario) {
        this.listaComentarios.add(comentario);
    }
}
