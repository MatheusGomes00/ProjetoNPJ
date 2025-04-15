// src/components/Clientes/AbaProcesso.js
import React from "react";
import {
  ClientesContainer,
  ClientesList,
  ClienteCard,
  ClienteNome,
  Status,
  Mensagem,
  NavegacaoContainer,
  BotaoNavegacao,
} from "./EstiloClientes";

const AbaProcesso = ({
  clientesFiltrados,
  isLoading,
  mensagemErro,
  nomeBusca,
  currentPage,
  totalPages,
  handleClienteClick,
  handlePreviousPage,
  handleNextPage,
}) => {
  return (
    <ClientesContainer>
      {isLoading ? (
        <Mensagem>Carregando clientes...</Mensagem>
      ) : mensagemErro ? (
        <Mensagem>{mensagemErro}</Mensagem>
      ) : clientesFiltrados.length === 0 && nomeBusca.length >= 4 ? (
        <Mensagem>Nenhum cliente encontrado.</Mensagem>
      ) : clientesFiltrados.length === 0 ? (
        <Mensagem>Nenhum cliente corresponde aos filtros selecionados.</Mensagem>
      ) : (
        <>
          <ClientesList>
            {clientesFiltrados.map((cliente) => (
              <ClienteCard
                key={cliente.id}
                onClick={() => handleClienteClick(cliente.id)}
                style={{ cursor: "pointer" }}
              >
                <ClienteNome>{cliente.cliente.nome}</ClienteNome>
                <Status ativo={cliente.status}>
                  Status: {cliente.status ? "Ativo" : "Inativo"}
                </Status>
              </ClienteCard>
            ))}
          </ClientesList>

          <NavegacaoContainer>
            <BotaoNavegacao onClick={handlePreviousPage} disabled={currentPage === 0}>
              ⬅️
            </BotaoNavegacao>
            <span>Página {currentPage + 1} de {totalPages}</span>
            <BotaoNavegacao
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              ➡️
            </BotaoNavegacao>
          </NavegacaoContainer>
        </>
      )}
    </ClientesContainer>
  );
};
//teste
export default AbaProcesso;