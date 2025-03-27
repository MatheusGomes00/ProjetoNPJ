package com.npj.ProjetoNPJ.clientes.dto;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
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

    @NotNull(message = "Contato não pode ser nulo!")
    private ContatoDto contato;

    private Boolean casaPropria;
}
