    package com.npj.ProjetoNPJ.processos.mapper;


    import com.npj.ProjetoNPJ.advogados.entity.Advogado;
    import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
    import com.npj.ProjetoNPJ.clientes.repository.CadastroRepository;
    import com.npj.ProjetoNPJ.processos.dtos.DtoProcessos;
    import com.npj.ProjetoNPJ.processos.dtos.Situacao;
    import com.npj.ProjetoNPJ.processos.entity.Processos;
    import org.springframework.beans.factory.annotation.Autowired;

    import java.util.List;
    import java.util.stream.Collectors;

    public class ProcessosMapper {


        public static Processos toEntity(DtoProcessos dto, List<Advogado> advogados, List<Cadastro> cliente) {
            Processos processo = new Processos();
            processo.setId(dto.getId());
            processo.setSituacao(dto.getSituacao() != null ? Situacao.valueOf(String.valueOf(dto.getSituacao())) : null);
            processo.setNumeroProcesso(dto.getNumeroProcesso());
            processo.setPasta(dto.getPasta());
            processo.setTipoAcaoClasse(dto.getTipoAcaoClasse());
            processo.setRepresentanteLegal(dto.getRepresentanteLegal());
            processo.setRequerido(dto.getRequerido());
            processo.setVara(dto.getVara());
            processo.setValorCausa(dto.getValorCausa());
            List<Advogado> responsaveis = advogados.stream()
                    .filter(advogado -> dto.getResponsaveisId().contains(advogado.getId()))
                    .collect(Collectors.toList());
            processo.setResponsaveis(responsaveis);
            List<Cadastro> clientes = cliente.stream()
                    .filter(cliente1 -> dto.getClienteId().contains(cliente1.getId()))
                    .toList();
            processo.setCliente(clientes);
            return processo;
        }

        public static DtoProcessos toDto(Processos processo) {
            DtoProcessos dto = new DtoProcessos();
            dto.setId(processo.getId());
            dto.setSituacao(processo.getSituacao() != null ? Situacao.valueOf(processo.getSituacao().name()) : null);
            dto.setNumeroProcesso(processo.getNumeroProcesso());
            dto.setPasta(processo.getPasta());
            dto.setTipoAcaoClasse(processo.getTipoAcaoClasse());
            dto.setRequerente(null);
            dto.setRepresentanteLegal(processo.getRepresentanteLegal());
            dto.setRequerido(processo.getRequerido());
            dto.setNpjRepresentando(null);
            dto.setVara(processo.getVara());
            dto.setValorCausa(processo.getValorCausa());
            if (processo.getResponsaveis() != null && !processo.getResponsaveis().isEmpty()) {
                List<String> ids = processo.getResponsaveis().stream()
                        .map(Advogado::getId)
                        .collect(Collectors.toList());
                dto.setResponsaveisId(ids);

                List<String> nomes = processo.getResponsaveis().stream()
                        .map(Advogado::getNome)
                        .collect(Collectors.toList());
                dto.setResponsaveisNome(nomes);


                if (processo.getCliente() != null && !processo.getCliente().isEmpty()){
                    List<String> idsCliente = processo.getCliente()
                            .stream()
                            .map(Cadastro::getId).collect(Collectors.toList());
                    dto.setClienteId(idsCliente);


                    List<String> nomesCli = processo.getCliente().stream()
                            .map(cadastro -> cadastro.getCliente().getNome())
                            .collect(Collectors.toList());
                    dto.setClienteNome(nomesCli);
                }

            }return dto;


        }

        public static List<DtoProcessos> toListDto(List<Processos> list) {

            return list.stream()
                    .map(ProcessosMapper::toDto)
                    .collect(Collectors.toList());
        }
    }

