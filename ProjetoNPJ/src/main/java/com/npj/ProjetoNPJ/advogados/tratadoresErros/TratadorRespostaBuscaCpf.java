package com.npj.ProjetoNPJ.advogados.tratadoresErros;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class TratadorRespostaBuscaCpf {
    @ExceptionHandler(AdvogadoNaoAchado.class)
    public ResponseEntity<Map<String, Object>> handleAdvogadoNaoAchado(AdvogadoNaoAchado ex, HttpServletRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "Not Found");
        body.put("message", ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }
}

