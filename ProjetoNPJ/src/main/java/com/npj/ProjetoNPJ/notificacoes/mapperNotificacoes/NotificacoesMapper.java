package com.npj.ProjetoNPJ.notificacoes.mapperNotificacoes;

import com.npj.ProjetoNPJ.clientes.dto.CadastroDto;
import com.npj.ProjetoNPJ.clientes.entitie.Cadastro;
import com.npj.ProjetoNPJ.notificacoes.NotificacoesMain;
import com.npj.ProjetoNPJ.notificacoes.dtos.NotificacoesDto;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class NotificacoesMapper {


        public static NotificacoesMain toEntitie(NotificacoesDto dto) {
            return new ModelMapper().map(dto, NotificacoesMain.class);
        }

        public static NotificacoesDto toDto(NotificacoesMain notificacoesMain) {
            return new ModelMapper().map(notificacoesMain, NotificacoesDto.class);
        }

        public static List<NotificacoesDto> toListDto(List<NotificacoesMain> list) {
            return list.stream()
                    .map(NotificacoesMapper::toDto)
                    .collect(Collectors.toList());
        }
    }


