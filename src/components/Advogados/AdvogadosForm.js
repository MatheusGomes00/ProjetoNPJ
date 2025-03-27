import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "./AdvogadosStyles";


function AdvogadoForm({ onSubmit, initialData }) {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
      defaultValues: {
        nome: "",
        datanasc: "",
        cpf: "",
        registroOab: "",
        secaoOab: "",
        status: true,
        senha: "",
        repeteSenha: "",
      },
    });
  
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showSenha, setShowSenha] = useState(false);
    const [showRepeteSenha, setShowRepeteSenha] = useState(false);
  
    const senhaValue = watch("senha");
  
    //   Atualiza os valores do formulário quando initialData muda
    useEffect(() => {
        if (initialData) {
        reset({
            ...initialData,
            senha: "", 
            repeteSenha: "",
        });
        }
    }, [initialData, reset]);

    const togglePasswordFields = () => {
      setShowPasswordFields((prev) => !prev);
    };
  
    const toggleShowSenha = () => {
      setShowSenha((prev) => !prev);
    };
  
    const toggleShowRepeteSenha = () => {
      setShowRepeteSenha((prev) => !prev);
    };
  
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h2>Seu Cadastro</h2>
    
          <div>
            <label>Nome:</label>
            <input type="text" {...register("nome", { required: true })} />
          </div>
    
          <div>
            <label>Data de Nascimento:</label>
            <input type="date" {...register("datanasc", { required: true })} />
          </div>
    
          <div>
            <label>CPF:</label>
            <input type="text" {...register("cpf", { required: true, maxLength: 11 })} />
          </div>
    
          <div>
            <label>Registro OAB:</label>
            <input type="text" {...register("registroOab", { required: false })} />
          </div>
    
          <div>
            <label>Seção OAB:</label>
            <input type="text" {...register("secaoOab", { required: false })} />
          </div>
    
          <div>
            <label>Status:</label>
            <select {...register("status")}>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
    
          <button type="button" className="change-password-btn" onClick={togglePasswordFields}>
            {showPasswordFields ? "Cancelar" : "Alterar Senha"}
          </button>
    
          {showPasswordFields && (
            <>
              <div className="password-container">
                <label>Nova Senha:</label>
                <input
                  type={showSenha ? "text" : "password"}
                  {...register("senha", { required: showPasswordFields })}
                />
                <button type="button" className="password-toggle" onClick={toggleShowSenha}>
                  {showSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <div className="password-container">
                <label>Repetir Senha:</label>
                <input
                  type={showRepeteSenha ? "text" : "password"}
                  {...register("repeteSenha", {
                    required: showPasswordFields ? "Repetir senha é obrigatório" : false,
                    validate: (value) =>
                      !showPasswordFields || value === senhaValue || "As senhas não coincidem",
                  })}
                />
                <button type="button" className="password-toggle" onClick={toggleShowRepeteSenha}>
                  {showRepeteSenha ? "Ocultar" : "Mostrar"}
                </button>
                {errors.repeteSenha && (
                  <span style={{ color: "red", fontSize: "12px" }}>{errors.repeteSenha.message}</span>
                )}
              </div>
            </>
          )}
    
          <button type="submit">Salvar</button>
        </Form>
    );
}
    
export default AdvogadoForm;