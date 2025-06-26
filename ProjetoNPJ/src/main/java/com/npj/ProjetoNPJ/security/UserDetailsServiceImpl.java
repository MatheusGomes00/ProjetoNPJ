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
    public UserDetails loadUserByUsername(String cpf) throws UsernameNotFoundException {

        Advogado advogado = repository
                .findByCpf(normalizarCpf(cpf))
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao localizado."));

        return new UserAutenticado(advogado);
    }

    private String normalizarCpf(String cpf) {
        return cpf.replaceAll("[.\\-\\s]", "");
    }

    public UserDetails loadUserById(String userId) {

        Advogado advogado = repository.findById(userId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao localizado"));
        return  new UserAutenticado(advogado);
    }
}
