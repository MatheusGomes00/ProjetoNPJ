package com.npj.ProjetoNPJ.security;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import com.npj.ProjetoNPJ.advogados.repository.AdvogadoRepository;
import com.npj.ProjetoNPJ.exceptions.RecursoNaoEncontradoException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdvogadoRepository repository;

    public UserDetailsServiceImpl(AdvogadoRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Advogado advogado = repository
                .findById(username)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Username nao localizado."));

        return new UserAutenticado(advogado);
    }

//    public String normalizarCpf(String cpf) {
//        return cpf.replaceAll("[.\\-\\s]", "");
//    }
}
