package com.npj.ProjetoNPJ.clientes.dto;


import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PreCadastroDto {

   private String nome;

   private String cpf;

   private String celular;

   private String dataNasc;

   private LocalDate diaAgendado;


}
