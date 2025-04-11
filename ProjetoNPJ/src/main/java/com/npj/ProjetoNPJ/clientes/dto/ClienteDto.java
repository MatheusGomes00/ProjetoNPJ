package com.npj.ProjetoNPJ.clientes.dto;


import com.npj.ProjetoNPJ.processos.entity.Processos;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
//import org.hibernate.validator.constraints.br.CPF;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ClienteDto {

    @NotBlank(message = "Nome não pode ser nulo ou estar em branco!")
    private String nome;

    @Valid
    @NotNull(message = "Endereço não pode ser nulo!")
    private EnderecoDto endereco;

    @NotBlank(message = "CPF não pode ser nulo ou estar em branco!")
    private String cpf;

    private String rg;

    private String ssp; // secretaria de segurança publica

    private String nascimento;


    private ContatoDto contato;

    private Boolean casaPropria;

    private List<Processos> processo;


}
