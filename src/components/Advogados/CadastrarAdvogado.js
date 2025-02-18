import React, { useState } from 'react';
import axios from 'axios';

const CadastrarAdvogado = ({ onClose }) => {
  const [formData, setFormData] = useState({
    datanasc: '',
    registroOab: '',
    secaoOab: '',
    cpf: '',
    nome: ''
  });
  const [message, setMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:8080/adv/ins', formData);
      setMessage('Advogado cadastrado!');
      setIsPopupVisible(false);  // Fecha o pop-up após o envio
      onClose();  // Chama o onClose para informar ao componente pai que o pop-up deve ser fechado
    } catch (error) {
      setMessage('Erro ao cadastrar advogado.');
    }
  };

  return (
    <div>
      {isPopupVisible && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.container}>
            <h3>Cadastrar Novo</h3>
            <label>Data de Nascimento:</label>
            <input type="date" name="datanasc" value={formData.datanasc} onChange={handleChange} style={popupStyles.input} />
            <label>Registro OAB:</label>
            <input type="text" name="registroOab" value={formData.registroOab} onChange={handleChange} style={popupStyles.input} />
            <label>Seção OAB:</label>
            <input type="text" name="secaoOab" value={formData.secaoOab} onChange={handleChange} style={popupStyles.input} />
            <label>CPF:</label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} style={popupStyles.input} />
            <label>Nome:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} style={popupStyles.input} />
            
            {/* Botão de Cadastrar com estilização moderna */}
            <button onClick={handleSubmit} style={popupStyles.button}>Cadastrar</button>
            {/* Botão de Cancelar */}
            <button onClick={() => onClose()} style={popupStyles.button}>Cancelar</button>
          </div>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

// Estilos do pop-up e do botão
const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  // Estilização do botão
  button: {
    padding: '12px 25px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '30px', // Bordas mais arredondadas
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.3s', // Transições suaves
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave para dar profundidade
  },
  // Estilo do botão ao passar o mouse
  buttonHover: {
    backgroundColor: '#0056b3', // Cor do botão ao passar o mouse
    transform: 'scale(1.05)', // Efeito de aumento no botão ao passar o mouse
  },
};

export default CadastrarAdvogado;
