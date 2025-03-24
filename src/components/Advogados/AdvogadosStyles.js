import styled from "styled-components";

export const GridContainer = styled.div`
  height: calc(100% - 20px); /* Respeita o espaço do MainContent */
  width: calc(100% - 20px); /* Respeita o espaço do MainContent */
  display: flex; /* Centraliza o conteúdo */
  justify-content: center;
  align-items: center;
  padding: 20px; /* Espaçamento interno */
  overflow: auto; /* Permite rolagem se necessário */
`;

export const LawyerPage = styled.div`
  background: #fff; /* Fundo branco para destacar */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  padding: 20px;
  width: 100%;
  max-width: 600px; /* Largura máxima para legibilidade */
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  input {
    flex: 1; /* Ocupa espaço disponível */
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 8px 16px;
    background: #007bff; /* Azul padrão */
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: #0056b3; /* Tom mais escuro no hover */
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espaçamento entre campos */

  h2 {
    margin: 0 0 10px;
    text-align: center;
    color: #333;
  }

  div {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }

  input,
  select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  button[type="submit"] {
    padding: 10px;
    background: #28a745; /* Verde para salvar */
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: #218838; /* Tom mais escuro no hover */
    }
  }

  .change-password-btn {
    padding: 10px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: #0056b3;
    }

  .password-container {
    position: relative; 
  }

  .password-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #007bff;
    padding: 0;
    &:hover {
      color: #0056b3;
  }
  
`;