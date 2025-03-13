import React, { useState } from "react";


const Notificacoes = () => {


 

  const notificacoes = [
    { id: 1, titulo: "Novo Cliente", mensagem: "Novo cliente interessado." },
    { id: 2, titulo: "Pagamento Recebido", mensagem: "Pagamento confirmado." },
    { id: 3, titulo: "Novo Pedido", mensagem: "Novo pedido realizado." },
    { id: 4, titulo: "Atualização de Sistema", mensagem: "Sistema atualizado com sucesso." },
    { id: 5, titulo: "Alerta de Segurança", mensagem: "Nova vulnerabilidade identificada." },
    { id: 6, titulo: "Promoção Especial", mensagem: "Desconto de 20% em todos os produtos." },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: "535px",
        left: "624px",
        transform: "translateX(-50%)",
        border: "1px solid black",
        padding: "10px",
        width: "763px",
        maxWidth: "800px",
        maxHeight: "24%",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 20,
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px",
        overflowY: "auto",
      }}
    >
      <h2 style={{ gridColumn: "span 2", textAlign: "center", margin: "0 0 10px" }}>🔔 Suas Notificações</h2>
      {notificacoes.map((notificacao) => (
        <div
          key={notificacao.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ fontSize: "16px", margin: "0 0 4px" }}>🔔 {notificacao.titulo}</h3>
          <p style={{ fontSize: "14px", margin: 0 }}>{notificacao.mensagem}</p>
        </div>
      ))}
      <button
        style={{
          gridColumn: "span 2",
          padding: "10px",
          marginTop: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
       
      >
        Mostrar Tudo: ➕
      </button>

      
       
        
      
    </div>
  );
};

export default Notificacoes;
