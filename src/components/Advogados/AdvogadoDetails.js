import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

// Estilos para o formulário de detalhes
const FormContainer = styled.div`
  margin-top: 50px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Field = styled.div`
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
`;

function AdvogadoDetails() {
  const { id } = useParams();  // Pega o ID do advogado da URL
  const [advogado, setAdvogado] = useState(null);

  useEffect(() => {
    const fetchAdvogado = async () => {
      try {
        const response = await fetch(`http://localhost:8080/adv/buscar/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar dados do advogado");
        }
        const data = await response.json();
        setAdvogado(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };
    fetchAdvogado();
  }, [id]);

  if (!advogado) {
    return <div>Carregando...</div>;
  }

  return (
    <FormContainer>
      <h2>Detalhes do Advogado</h2>
      <Field><strong>Nome:</strong> {advogado.nome}</Field>
      <Field><strong>Data de Nascimento:</strong> {advogado.datanasc}</Field>
      <Field><strong>CPF:</strong> {advogado.cpf}</Field>
      <Field><strong>Registro OAB:</strong> {advogado.registroOab}</Field>
      <Field><strong>Sessão OAB:</strong> {advogado.secaoOab}</Field>
      <Field><strong>Status:</strong> {advogado.status ? 'Ativo' : 'Inativo'}</Field>
    </FormContainer>
  );
}

export default AdvogadoDetails;
