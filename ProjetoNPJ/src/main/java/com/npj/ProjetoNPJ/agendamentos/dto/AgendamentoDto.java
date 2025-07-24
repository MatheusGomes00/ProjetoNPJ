package com.npj.ProjetoNPJ.agendamentos.dto;

import com.npj.ProjetoNPJ.agenda.dto.ResponsavelDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
public class AgendamentoDto {

    private String id;

    @NotBlank
    private String nome;

    @NotBlank
    private String cpf;

    @NotNull(message = "O início é obrigatório")
    private LocalDateTime start;

    @NotNull(message = "O fim é obrigatório")
    private LocalDateTime end;

    @NotBlank
    private String casoTipo;

    @NotNull
    @NotEmpty
    private List<ResponsavelDto> responsaveis;


}
