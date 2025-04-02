package com.npj.ProjetoNPJ.processos.service;


import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.processos.dtos.DtoProcessos;
import com.npj.ProjetoNPJ.processos.dtos.Situacao;
import com.npj.ProjetoNPJ.processos.entity.Processos;
import com.npj.ProjetoNPJ.processos.mapper.ProcessosMapper;
import com.npj.ProjetoNPJ.processos.repository.ProcessosRepositorio;
import com.npj.ProjetoNPJ.security.JwtService;
import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
import com.npj.ProjetoNPJ.tarefas.mapper.TarefasMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProcessosService {

    @Autowired
    private AdvogadoRepository advrepository;

    @Autowired
    private ProcessosRepositorio processosRepositorio;

    @Autowired
    private JwtService jwtService;

    public DtoProcessos insert(DtoProcessos dto) {
        dto.setSituacao(Situacao.INICIADO);

        Processos processo = ProcessosMapper.toEntitie(dto);
        processo.setSituacao(Situacao.INICIADO);

        Processos processoSalvo = processosRepositorio.save(processo);
        return ProcessosMapper.toDto(processoSalvo);
    }

    public Processos update(DtoProcessos dto, String id){

        Processos processos = processosRepositorio.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Tarefa não encontrada."));
        updateData(processos, dto);
        processosRepositorio.save(processos);

        return processos;
    }


    public void updateData(Processos processos, DtoProcessos dto) {
        if (dto.getSituacao() != null) processos.setSituacao(dto.getSituacao());
        if (dto.getNumeroProcesso() != null) processos.setNumeroProcesso(dto.getNumeroProcesso());
        if (dto.getPasta() != null) processos.setPasta(dto.getPasta());
        if (dto.getTipoAcaoClasse() != null) processos.setTipoAcaoClasse(dto.getTipoAcaoClasse());
        if (dto.getRequerente() != null) processos.setRequerente(dto.getRequerente());
        if (dto.getRepresentanteLegal() != null) processos.setRepresentanteLegal(dto.getRepresentanteLegal());
        if (dto.getRequerido() != null) processos.setRequerido(dto.getRequerido());
        if (dto.getNpjRepresentando() != null) processos.setNpjRepresentando(dto.getNpjRepresentando());
        if (dto.getVara() != null) processos.setVara(dto.getVara());
        if (dto.getValorCausa() != null) processos.setValorCausa(dto.getValorCausa());

    }

    public List<DtoProcessos> findByNumeroProcesso(String numeroProcesso){

        List<Processos> processos = processosRepositorio.findByNumeroProcesso(numeroProcesso);
        if(processos.isEmpty()) {
            throw new RecursoNaoEncontradoException("Processo Nao localizada");
        }
        return ProcessosMapper.toListDto(processos);
    }
}
