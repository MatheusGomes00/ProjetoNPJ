const Notificacao = () => {
    return (
      <div
        style={{
          position: "fixed", // Fixa no topo da página
          top: "460px", // Ajusta a distância do topo
          left: "30%",
          transform: "translateX(-50%)", // Centraliza horizontalmente
          border: "1px solid #ccc",
          padding: "10px",
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#f9f9f9",
          borderRadius: "5px",
          zIndex: 1000, // Garante que a notificação ficará acima dos outros elementos
        }}
      >
        <h3>🔔 Nova Atualização no Sistema</h3>
        <p>
          O sistema foi atualizado com novos recursos de segurança e melhorias de
          desempenho. Por favor, reinicie sua sessão para aplicar as mudanças.
        </p>
        <p></p>
      </div>
    );
  };
  export default Notificacao