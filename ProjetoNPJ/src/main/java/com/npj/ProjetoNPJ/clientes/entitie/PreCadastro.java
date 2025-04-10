package com.npj.ProjetoNPJ.clientes.entitie;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cadastroCliente")
public class PreCadastro {

    @NotBlank
    private String nome;
    @NotBlank
    private String cpf;
    @NotBlank
    private String celular;
    @NotBlank
    private String dataNasc;
    @NotBlank
    private LocalDate diaAgendado;
}
