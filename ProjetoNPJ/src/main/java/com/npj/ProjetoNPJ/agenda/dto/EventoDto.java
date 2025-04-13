package com.npj.ProjetoNPJ.agenda.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestDto {

    @NotBlank
    public String periodo;

    
}
