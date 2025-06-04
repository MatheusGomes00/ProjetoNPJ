package com.npj.ProjetoNPJ.processos.service;


import com.mongodb.client.result.UpdateResult;
import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.advogados.service.AdvogadoService;
import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
import com.npj.ProjetoNPJ.clientes.repository.CadastroRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import com.npj.ProjetoNPJ.processos.dtos.ComentarioDto;
import com.npj.ProjetoNPJ.processos.dtos.ComentarioId;
import com.npj.ProjetoNPJ.processos.dtos.DtoProcessos;
import com.npj.ProjetoNPJ.processos.dtos.Situacao;
import com.npj.ProjetoNPJ.processos.entity.Processos;
import com.npj.ProjetoNPJ.processos.mapper.ProcessosMapper;
import com.npj.ProjetoNPJ.processos.repository.ProcessosRepositorio;
import com.npj.ProjetoNPJ.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
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

    private final MongoTemplate mongoTemplate;


    public ProcessosService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

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
        if (dto.getListaComentarios() != null) processos.setListaComentarios(dto.getListaComentarios());

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

        return processosRepositorio.findById(id).
                orElseThrow(()-> new RecursoNaoEncontradoException("Processo nao encontrado"));
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


    public ComentarioDto criarComentario(ComentarioDto comentarioDto, String idProc) {
        try{
            comentarioDto.setId(UUID.randomUUID().toString());
            comentarioDto.setResponsavelId(advService.getAuthenticatedUsername());
            comentarioDto.setResponsavelNome(advService.buscarNomeAutenticado());
            Processos processo = processosRepositorio.findById(idProc)
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Processo não localizado."));

            List<ComentarioDto> comentarios = processo.getListaComentarios();
            if (comentarios == null) {
                comentarios = new ArrayList<>();
                processo.setListaComentarios(comentarios);
            }
            processo.addComentario(comentarioDto);

            Update update = new Update().push("listaComentarios", comentarioDto);
            mongoTemplate.updateFirst(Query.query(Criteria.where("_id").is(idProc)), update, Processos.class);
            return comentarioDto;
        } catch (Exception ex) {
            throw new RuntimeException(ex.getMessage() + " " + ex.getClass());
        }
    }


    public void atualizarComentario(String processoId, ComentarioDto comentario) {
        try {
            Query query = new Query(Criteria
                    .where("_id")
                    .is(processoId)
                    .and("listaComentarios.id")
                    .is(comentario.getId()));
            Update update = new Update()
                    .set("listaComentarios.$.dataModif", comentario.getDataModif())
                    .set("listaComentarios.$.responsavelId", comentario.getResponsavelId())
                    .set("listaComentarios.$.responsavelNome", comentario.getResponsavelNome())
                    .set("listaComentarios.$.comentarios", comentario.getComentarios());
            UpdateResult result = mongoTemplate.updateFirst(query, update, Processos.class);
            if (result.getMatchedCount() == 0) {
                throw new RuntimeException("Processo ou comentário não encontrado");
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex.getMessage() + " " + ex.getClass());
        }
    }


    public void apagarComentario(String processoId, String comentarioId) {
        Query query = new Query(Criteria.where("_id").is(processoId));
        Update update = new Update()
                .pull("listaComentarios", new Query(Criteria.where("_id").is(comentarioId)));
        UpdateResult result = mongoTemplate.updateFirst(query, update, Processos.class);
        if (result.getMatchedCount() == 0) {
            throw new RuntimeException("Processo ou comentário não encontrado");
        }
    }
}

