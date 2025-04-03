    package com.npj.ProjetoNPJ.processos.mapper;

    import com.npj.ProjetoNPJ.advogados.dtos.DtoAdvogado;
    import com.npj.ProjetoNPJ.advogados.dtos.ResponseAdvogadoDto;
    import com.npj.ProjetoNPJ.advogados.dtos.UpdateRequestDto;
    import com.npj.ProjetoNPJ.advogados.entity.Advogado;
    import com.npj.ProjetoNPJ.advogados.mapper.AdvogadoMapper;
    import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
    import com.npj.ProjetoNPJ.processos.dtos.DtoProcessos;
    import com.npj.ProjetoNPJ.processos.dtos.Situacao;
    import com.npj.ProjetoNPJ.processos.entity.Processos;
    import com.npj.ProjetoNPJ.tarefas.dtos.DtoTarefas;
    import com.npj.ProjetoNPJ.tarefas.entity.Tarefas;
    import com.npj.ProjetoNPJ.tarefas.mapper.TarefasMapper;
    import org.modelmapper.ModelMapper;

    import java.util.List;
    import java.util.stream.Collectors;

    public class ProcessosMapper {

        public static Processos toEntitie(DtoProcessos dto, List<Advogado> advogados, List<Cadastro> cliente) {
            Processos processo = new Processos();
            processo.setId(dto.getId());
            processo.setSituacao(dto.getSituacao() != null ? Situacao.valueOf(String.valueOf(dto.getSituacao())) : null);
            processo.setNumeroProcesso(dto.getNumeroProcesso());
            processo.setPasta(dto.getPasta());
            processo.setTipoAcaoClasse(dto.getTipoAcaoClasse());
            processo.setRepresentanteLegal(dto.getRepresentanteLegal());
            processo.setRequerido(dto.getRequerido());
            processo.setVara(dto.getVara());
            processo.setAdvogadosResponsaveis(dto.getAdvogadosResponsaveis());
            processo.setCliente(dto.getCliente());
            return processo;
        }

            public static Processos toEntitie(UpdateRequestDto dto){

                return new ModelMapper().map(dto, Processos.class);
            }

        public static DtoProcessos toDto(Processos processo) {
            DtoProcessos dto = new DtoProcessos();
            dto.setId(processo.getId());
            dto.setSituacao(processo.getSituacao() != null ? Situacao.valueOf(processo.getSituacao().name()) : null);
            dto.setNumeroProcesso(processo.getNumeroProcesso());
            dto.setPasta(processo.getPasta());
            dto.setTipoAcaoClasse(processo.getTipoAcaoClasse());
            // Para requerente, npjRepresentando e cliente, você pode buscar os objetos completos se necessário
            dto.setRequerente(null); // Simplificado; ajuste se precisar do objeto Cliente
            dto.setRepresentanteLegal(processo.getRepresentanteLegal());
            dto.setRequerido(processo.getRequerido());
            dto.setNpjRepresentando(null); // Simplificado; ajuste se precisar do objeto Advogado
            dto.setVara(processo.getVara());
            dto.setValorCausa(processo.getValorCausa());
            dto.setCliente(null); // Simplificado; ajuste se precisar do objeto Cliente
            //dto.setAdvogadosResponsaveis(processo.getAdvogadosResponsaveis().);
            return dto;
        }

        public static DtoProcessos toListDto(Processos processo) {
            DtoProcessos dto = new DtoProcessos();
            dto.setId(processo.getId());
            dto.setSituacao(processo.getSituacao());
            dto.setNumeroProcesso(processo.getNumeroProcesso());
            dto.setPasta(processo.getPasta());
            dto.setTipoAcaoClasse(processo.getTipoAcaoClasse());
            dto.setRequerido(processo.getRequerido());
            dto.setVara(processo.getVara());
            dto.setValorCausa(processo.getValorCausa());
            dto.setAdvogadosResponsaveis(processo.getAdvogadosResponsaveis());
            dto.setCliente(processo.getCliente());
            return dto;
        }

        public static List<DtoProcessos> toListDto(List<Processos> list) {
            return list.stream()
                    .map(ProcessosMapper::toListDto)
                    .collect(Collectors.toList());
        }
    }

