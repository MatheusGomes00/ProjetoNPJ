package com.npj.ProjetoNPJ.triagem.dto;

import com.npj.ProjetoNPJ.triagem.entitie.Contato;
import com.npj.ProjetoNPJ.triagem.entitie.Endereco;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
//import org.hibernate.validator.constraints.br.CPF;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ClienteDto {

    @NotBlank
    private String nome;
    @NotBlank
    private EnderecoDto endereco;
    @NotBlank
    private String cpf;
    private String rg;
    private String ssp; // secretaria de segurança publica
    private String nascimento;
    private ContatoDto contato;
    private Boolean casaPropria;
}
