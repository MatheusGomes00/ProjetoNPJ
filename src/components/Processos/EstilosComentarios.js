import styled from 'styled-components';

// Estilos para o cartão clicável
export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

// Conteúdo interno do cartão
export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > div {
    font-size: 14px;
    color: #333333;
  }

  & > div:first-child {
    font-weight: 600;
  }

  & > div:nth-child(2) {
    color: #666666;
    font-size: 12px;
  }
`;

// Prévia do comentário (50 palavras)
export const CardPreview = styled.p`
  font-size: 14px;
  color: #444444;
  margin: 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

// Modal para exibição/edição do comentário
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 16px;
`;

// Conteúdo do modal
export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  h3 {
    margin: 0 0 16px;
    font-size: 18px;
    color: #333333;
  }

  textarea {
    width: 100%;
    min-height: 100px;
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    resize: vertical;
    transition: border-color 0.2s;

    &:focus {
      border-color: #007bff;
      outline: none;
    }

    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    max-width: 90%;
  }
`;

// Ações do modal (botões)
export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;

  button {
    padding: 8px 16px;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;

    button {
      flex: 1;
      min-width: 100px;
    }
  }
`;