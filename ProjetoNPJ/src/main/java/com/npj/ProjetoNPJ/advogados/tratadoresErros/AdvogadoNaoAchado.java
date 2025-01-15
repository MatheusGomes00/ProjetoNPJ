package com.npj.ProjetoNPJ.advogados.tratadoresErros;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class AdvogadoNaoAchado extends RuntimeException {

    public AdvogadoNaoAchado(String message){
        super(message);
    }

}

