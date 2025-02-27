import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';

const CadastrarAdvogado = ({ onClose }) => {
  const [formData, setFormData] = useState({
    datanasc: '',
    registroOab: '',
    secaoOab: '',
    cpf: '',
    nome: '',
    senha: '',
    role: 'ADVOGADO'
  });
  
  const [message, setMessage] = useState('');
  const [errorPopup, setErrorPopup] = useState(false);
  const errorRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const getToken = () => {
    return localStorage.getItem("token"); // Certifique-se de que o token está salvo corretamente
  };
  
  const handleSubmit = async () => {
    try {
      const token = getToken();
      await axios.post('http://localhost:8080/adv/ins', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setMessage('Advogado cadastrado!');
      setErrorPopup(false);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 409) {
          setMessage("O advogado já está cadastrado! Verifique os dados.");
        } else if (status === 400) {
          setMessage("Dados inválidos! Preencha os campos corretamente.");
        } else if (status === 403) {
          setMessage("Permissão insuficiente! Recurso disponível apenas para supervisores.");
        }
      } else {
        setMessage("Erro inesperado! Contate o administrador.");
      }
      setErrorPopup(true);
    }
  };

  // Rolagem automática para a mensagem de erro
  useEffect(() => {
    if (errorPopup && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorPopup]);

  return (
    <div>
        <div style={popupStyles.overlay}>
          <div style={popupStyles.container}>
            <h3>Cadastro novo usuário</h3>

            <label style={popupStyles.label}>Data de Nascimento:</label>
            <input type="date" name="datanasc" value={formData.datanasc} onChange={handleChange} style={popupStyles.input} />

            <label style={popupStyles.label}>Registro OAB:</label>
            <input type="text" name="registroOab" value={formData.registroOab} onChange={handleChange} style={popupStyles.input} />

            <label style={popupStyles.label}>Seção OAB:</label>
            <input type="text" name="secaoOab" value={formData.secaoOab} onChange={handleChange} style={popupStyles.input} />

            <label style={popupStyles.label}>CPF:</label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} style={popupStyles.input} />

            <label style={popupStyles.label}>Nome:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} style={popupStyles.input} />

            <label style={popupStyles.label}>Senha:</label>
            <input 
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              style={popupStyles.input}
            />

            <label style={popupStyles.label}>Cargo:</label>
            <select name="role" value={formData.role} onChange={handleChange} style={popupStyles.input}>
              <option value="ADVOGADO">ADVOGADO</option>
              <option value="ESTAGIARIO">ESTAGIARIO</option>
            </select>

            <button onClick={handleSubmit} style={popupStyles.button}>Cadastrar</button>
            <button onClick={onClose} style={popupStyles.button}>Cancelar</button>

            {errorPopup && (
            <div ref={errorRef} style={popupStyles.errorPopup}>
              <p>{message}</p>
              <button onClick={() => setErrorPopup(false)} style={popupStyles.closeButton}>Fechar</button>
            </div>
          )}
          </div>
        </div>
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
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Garante que o popup fique acima de outros elementos
  },
  container: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
    maxHeight: "90vh", // Define um limite máximo de altura
    overflowY: "auto", // Adiciona rolagem se necessário
    overflowX: "hidden",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start", // Alinha à esquerda dentro do container
    marginBottom: "5px", // Pequeno espaçamento abaixo do label
    fontWeight: "bold", // Opcional: negrito para melhor leitura
    color: "#333", // Cor mais suave
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  closeButton: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  closeButtonHover: {
    backgroundColor: '#a71d2a',
  },
  errorPopup: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "white",
    color: "red",
    fontWeight: "bold",
    borderRadius: "5px",
    fontSize: "14px",
    textAlign: "center",
    width: "100%",
  },
};

export default CadastrarAdvogado;
