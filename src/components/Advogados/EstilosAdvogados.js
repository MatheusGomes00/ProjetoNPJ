import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styled from "styled-components";

// Estilo do título da seção
export const SectionTitle = styled.h3`
  font-family: "Arial", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1e3c72;
  margin: 0 0 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e0e4e8;
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// Estilo para os campos de formulário
export const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
`;

export const FormLabel = styled.label`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1e3c72;
  width: 120px;
  margin-right: 10px;

  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
  }
`;

export const FormInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Arial", sans-serif;
  color: #333;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const FormSelect = styled.select`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Arial", sans-serif;
  color: #333;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

// Estilo para mensagens
export const Mensagem = styled.p`
  font-family: "Arial", sans-serif;
  font-size: 16px;
  color: #7f8c8d;
  text-align: center;
  margin: 20px 0;
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

// Estilo para o pop-up de feedback
export const Popup = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  animation: fadeInOut 2s ease-in-out;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;
