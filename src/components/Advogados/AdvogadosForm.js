import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "./AdvogadosStyles";


function AdvogadoForm({ onSubmit, initialData, mode = "profile", isEditable = true, onBack, userRole }) {
  const { register, handleSubmit, reset, watch, formState: { errors }, setValue } = useForm({
    defaultValues: {
      nome: "",
      datanasc: "",
      cpf: "",
      registroOab: "",
      secaoOab: "",
      status: true,
      role: "ADVOGADO",
      senha: "",
      repeteSenha: "",
    },
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showRepeteSenha, setShowRepeteSenha] = useState(false);

  const senhaValue = watch("senha");  // monitora a senha nos modos
  const roleValue = watch("role");  // monitora a role nos modos

  useEffect(() => {
    if (initialData && mode !== "create") {
      reset({
        nome: initialData.nome || "",
        datanasc: initialData.datanasc || "",
        cpf: initialData.cpf || "",
        registroOab: initialData.registroOab || "", 
        secaoOab: initialData.secaoOab || "", 
        status: initialData.status ?? true, 
        role: initialData.role || "ADVOGADO",
        senha: "",
        repeteSenha: "",
      }, { keepValues: false });
    } else if (mode === "create") {
      reset({
        nome: "",
        datanasc: "",
        cpf: "",
        registroOab: "",
        secaoOab: "",
        status: true,
        role: "ADVOGADO",
        senha: "",
        repeteSenha: "",
      }, { keepValues: false });
    }
  }, [initialData, mode, reset]);

  useEffect(() => {
    if (roleValue === "ESTAGIARIO") {
      setValue("registroOab", "");
      setValue("secaoOab", "");
    }
  }, [roleValue, mode, setValue]);

  const togglePasswordFields = () => {
    setShowPasswordFields((prev) => !prev);
  };

  const toggleShowSenha = () => {
    setShowSenha((prev) => !prev);
  };

  const toggleShowRepeteSenha = () => {
    setShowRepeteSenha((prev) => !prev);
  };

  // Determina se os campos OAB devem ser exibidos com base no valor atual de "Cargo"
  const showOabFields = mode === "profile" ? (initialData?.role === "ADVOGADO") : (roleValue === "ADVOGADO");

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>
        {mode === "create" ? "Cadastrar Advogado" : mode === "profile" ? "Seu Cadastro" : "Cadastro"}
      </h2>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          {...register("nome", { required: "Nome é obrigatório" })}
          disabled={!isEditable}
        />
        {errors.nome && <span style={{ color: "red", fontSize: "12px" }}>{errors.nome.message}</span>}
      </div>

      <div>
        <label>Data de Nascimento:</label>
        <input 
          type="date" 
          {...register("datanasc", { required: "Data de nascimento é obrigatória" })} 
          disabled={!isEditable}
        />
        {errors.datanasc && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.datanasc.message}</span>
        )}
      </div>

      <div>
        <label>CPF:</label>
        <input
          type="text"
          {...register("cpf", { required: "CPF é obrigatório" })}
          disabled={!isEditable}
        />
        {errors.cpf && <span style={{ color: "red", fontSize: "12px" }}>{errors.cpf.message}</span>}
      </div>

      <div>
        <label>Cargo:</label>
        <select {...register("role")} disabled={!isEditable || userRole === "ESTAGIARIO"}>
          <option value="ADVOGADO">Advogado</option>
          <option value="ESTAGIARIO">Estagiário</option>
        </select>
      </div>

      {showOabFields && (
        <>
          <div>
            <label>Registro OAB:</label>
            <input
              type="text"
              {...register("registroOab", { required: roleValue === "ADVOGADO" && "Registro OAB é obrigatório" })}
              disabled={!isEditable}
            />
            {errors.registroOab && (
              <span style={{ color: "red", fontSize: "12px" }}>{errors.registroOab.message}</span>
            )}
          </div>

          <div>
            <label>Seção OAB:</label>
            <input
              type="text"
              {...register("secaoOab", { required: roleValue === "ADVOGADO" && "Seção OAB é obrigatória" })}
              disabled={!isEditable}
            />
            {errors.secaoOab && (
              <span style={{ color: "red", fontSize: "12px" }}>{errors.secaoOab.message}</span>
            )}
          </div>
        </>
      )}

      <div>
        <label>Status:</label>
        <select {...register("status")} disabled={!isEditable}>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>

      {mode === "create" && (
        <>
          <div className="password-container">
            <label>Senha:</label>
            <input
              type={showSenha ? "text" : "password"}
              {...register("senha", { required: "Senha é obrigatória" })}
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
                required: "Repetir senha é obrigatória",
                validate: (value) => value === senhaValue || "As senhas não coincidem",
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

      {mode === "profile" && (
        <button type="button" className="change-password-btn" onClick={togglePasswordFields}>
          {showPasswordFields ? "Cancelar" : "Alterar Senha"}
        </button>
      )}

      {showPasswordFields && mode === "profile" && (
        <>
          <div className="password-container">
            <label>Nova Senha:</label>
            <input
              type={showSenha ? "text" : "password"}
              {...register("senha", { required: showPasswordFields && "Nova senha é obrigatória" })}
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
                required: showPasswordFields && "Repetir senha é obrigatória",
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

      {isEditable && (
        <button type="submit">
          {mode === "create" ? "Cadastrar" : "Salvar"}
        </button>
      )}

      {(mode === "search" || mode === "create") && (
        <button type="button" className="backButton" onClick={onBack}>
          Voltar
        </button>
      )}
    </Form>
  );
}
    
export default AdvogadoForm;