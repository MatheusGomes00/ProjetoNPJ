package com.npj.ProjetoNPJ.processos.service;


import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;
import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
import com.npj.ProjetoNPJ.clientes.entitie.Cliente;
import com.npj.ProjetoNPJ.clientes.repository.CadastroRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.processos.dtos.ComentarioDto;
import com.npj.ProjetoNPJ.processos.dtos.ComentariosDto;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static com.npj.ProjetoNPJ.processos.dtos.Situacao.FINALIZADO;

@Service
public class ProcessosService {

    @Autowired
    private AdvogadoRepository advrepository;

    @Autowired
    private AdvogadoService advService;

    @Autowired
    private ProcessosRepositorio processosRepositorio;

    @Autowired
    private CadastroRepository clienterepository;

    @Autowired
    private JwtService jwtService;

    public DtoProcessos insertProcesso(DtoProcessos dto) {
        dto.setSituacao(Situacao.INICIADO);
        // dto.setValorCausa(dto.getValorCausa());
        List<Advogado> advogados = dto.getResponsaveisId().stream()
                .map(id -> advrepository.findById(String.valueOf(id))
                        .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: " + id)))
                .collect(Collectors.toList());

       List<Cadastro> cliente = dto.getClienteId().stream()
              .map(id -> clienterepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: " + id)))
               .toList();


        Processos processo = ProcessosMapper.toEntity(dto, advogados, cliente);

        // processo.setSituacao(Situacao.INICIADO);

        Processos processoSalvo = processosRepositorio.save(processo);
        return ProcessosMapper.toDto(processoSalvo);
    }

    public Processos update(DtoProcessos dto, String id){

        Processos processos = processosRepositorio.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Processo não encontrado."));
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
        if (dto.getComentarios() != null) processos.setComentarios((ComentariosDto) dto.getComentarios());

        if (dto.getResponsaveisId() != null && !dto.getResponsaveisId().isEmpty()) {
            List<Advogado> advogados = dto.getResponsaveisId().stream()
                    .map(id -> advrepository.findById(id)
                            .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: " + id)))
                    .collect(Collectors.toList());
            // System.out.println("Advogados encontrados para atualização: " + advogados);
            processos.setResponsaveis(advogados);


            if (dto.getClienteId() != null && !dto.getClienteId().isEmpty()){
                List<Cadastro> clientes = dto.getClienteId().stream()
                        .map(id-> clienterepository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrado: " + id)))
                        .collect(Collectors.toList());

            processos.setCliente(clientes);
            }



        }
    }
    public List<DtoProcessos> findByNumeroProcesso(String numeroProcesso){

        List<Processos> processos = processosRepositorio.findByNumeroProcesso(numeroProcesso);
        if(processos.isEmpty()) {
            throw new RecursoNaoEncontradoException("Processo Nao localizada");
        }
        return ProcessosMapper.toListDto(processos);
    }

    public List<DtoProcessos> findAll() {
        List<Processos> processos = processosRepositorio.findAll();
        return ProcessosMapper.toListDto(processos);
    }

    public Processos excluir( String id){

        Processos excluirProc = processosRepositorio.findById(id)
                .orElseThrow(()-> new RecursoNaoEncontradoException("Processo nao encontrado"));
        excluirProc.setSituacao(FINALIZADO);
        processosRepositorio.save(excluirProc);
        return excluirProc;
    }

    public Processos findById(String id){

        Processos acharPorID = processosRepositorio.findById(id).
                orElseThrow(()-> new RecursoNaoEncontradoException("Processo nao encontrado"));

        return acharPorID;
    }

    public List<DtoProcessos> findByCliente(String clienteNome) {

        List<Processos> processos = processosRepositorio.findByCliente(clienteNome);


        if(processos.isEmpty()) {
            throw new RecursoNaoEncontradoException("Processo Nao localizada");
        }
        return ProcessosMapper.toListDto(processos);
    }

    public List<DtoProcessos> findByClienteId(String clienteId) {

        List<Processos> processos = processosRepositorio.findByClienteId(clienteId);

        return ProcessosMapper.toListDto(processos);
    }

    public List<DtoProcessos> findByAdvogadoId(String advogadoID){

        List<Processos> processos = processosRepositorio.findByAdvogadoId(advogadoID);

        return ProcessosMapper.toListDto(processos);
    }
    public String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    public List<DtoProcessos> getProcAutenticado() {

        Advogado advogado = advrepository.findById(getAuthenticatedUsername())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Advogado não encontrada"));
        List<Processos> tarefa = processosRepositorio.findByAdvogadoId(advogado.getId());

        return ProcessosMapper.toListDto(tarefa);
    }

    public ComentariosDto criarComentario(ComentarioDto comentarioDto, String idProc) {
        comentarioDto.setResponsavelId(advService.getAuthenticatedUsername());
        comentarioDto.setResponsavelNome(advService.buscarNomeAutenticado());
        Processos processo = processosRepositorio.findById(idProc)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Processo não localizado."));
        ComentariosDto comentarios = processo.getComentarios();
        comentarios.addComentario(comentarioDto);
        processo.setComentarios(comentarios);
        processosRepositorio.save(processo);
        return processo.getComentarios();
    }
}

