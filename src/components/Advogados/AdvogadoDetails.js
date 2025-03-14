import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importando o useNavigate
import styled from "styled-components";
import Sidebar from "../ComponentesPadroes/Sidebar";
import SearchBarTop from "../ComponentesPadroes/SearchBarTop";
import IconeLogOut from "../botoesTelaImovel/IconeLogOut";
import IconeNotificacoes from "../botoesTelaImovel/IconeNotificacoes";
import IconeNovaTarefa from "../botoesTelaImovel/IconeNovaTarefa";
import useAuth from "../Seguranca/UseAuth";

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin-left: 250px;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
`;

const FormContainer = styled.div`
  margin-top: 50px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 720px;
  margin-left: auto;
  margin-right: auto;
`;

const Field = styled.div`
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  display: inline-block;
  &:hover {
    background-color: #0056b3;
  }
`;

function AdvogadoDetails() {
  const { id } = useParams();
  const [advogado, setAdvogado] = useState(null);
  const navigate = useNavigate();
  const { fetchAuthenticated } = useAuth();

  useEffect(() => {
    const fetchAdvogado = async () => {
      try {
        
        const response = await fetchAuthenticated(`http://localhost:8080/adv/buscar/${id}`, {
            method: "GET"});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdvogado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetchAuthenticated(`http://localhost:8080/adv/upd/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(advogado),
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar os dados");
      }
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar os dados");
    }
  };

  const handleBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  if (!advogado) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <Sidebar />
      <Content>
        <SearchBarTop />
        <FormContainer>
          <BackButton onClick={handleBack}>Voltar</BackButton> {/* Botão de Voltar */}
          <h2>Detalhes do Advogado</h2>
          <Field>
            <strong>Nome:</strong>
            <Input
              type="text"
              name="nome"
              value={advogado.nome}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <strong>Data de Nascimento:</strong>
            <Input
              type="text"
              name="datanasc"
              value={advogado.datanasc}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <strong>CPF:</strong>
            <Input
              type="text"
              name="cpf"
              value={advogado.cpf}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <strong>Registro OAB:</strong>
            <Input
              type="text"
              name="registroOab"
              value={advogado.registroOab}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <strong>Sessão OAB:</strong>
            <Input
              type="text"
              name="secaoOab"
              value={advogado.secaoOab}
              onChange={handleChange}
            />
          </Field>
          <Field>
            <strong>Status:</strong>
            <select
              name="status"
              value={advogado.status}
              onChange={handleChange}
            >
              <option value={true}>Ativo</option>
              <option value={false}>Inativo</option>
            </select>
          </Field>
          <button onClick={handleSave}>Salvar</button>
        </FormContainer>
      </Content>
      <div className="top-right-icons">
        <IconeLogOut />
        <IconeNotificacoes />
        <IconeNovaTarefa />
      </div>
      <div className="corner-label">
        <span className="corner-label-npj">NPJ</span>
        <br />
        <span className="corner-label-anhanguera">ANHANGUERA</span>
      </div>
    </Container>
  );
}

export default AdvogadoDetails;
