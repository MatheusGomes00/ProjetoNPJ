package com.npj.ProjetoNPJ.security;

import com.npj.ProjetoNPJ.advogados.entity.Advogado;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserAutenticado implements UserDetails {

    private final Advogado advogado;

    public UserAutenticado (Advogado advogado) {
        this.advogado=advogado;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + advogado.getRole().name()));
    }

    public String getId() { return advogado.getId(); }

    @Override
    public String getPassword() {
        return advogado.getSenha();
    }

    @Override
    public String getUsername() {
        return advogado.getCpf();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
