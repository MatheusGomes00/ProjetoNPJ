import React, { useEffect, useState } from "react";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import { GridContainer, LawyerPage, Header } from "./AdvogadosStyles";
import AdvogadoForm from "./AdvogadosForm";


function AdvogadosTela() {
  const { fetchAuthenticated, getId } = useAuth();
  const [advogadoData, setAdvogadoData] = useState(null);

  const id = getId();

  useEffect(() => {
    const buscarAutenticado = async () => {
      if (!id) {
        console.error("ID do advogado não encontrado");
        return;
      }
      try {
        const response = await fetchAuthenticated(`http://localhost:8080/adv/buscar/${id}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Erro ao carregar dados do advogado");
        }
        const data = await response.json();
        setAdvogadoData(data);
      } catch (error) {
        console.error("Erro:", error);
      }
    };
    buscarAutenticado();
  }, [id]);

  const onSubmit = async(data) => {
    if (!id) {
      console.error("ID do advogado não encontrado");
      return;
    }

    try {
      // Cria o objeto do corpo dinamicamente
      const requestBody = {
        nome: data.nome,
        datanasc: data.datanasc,
        cpf: data.cpf,
        registroOab: data.registroOab,
        secaoOab: data.secaoOab,
        status: data.status,
      };

      // Adiciona senha apenas se estiver preenchida
      if (data.senha && data.senha.trim() !== "") {
        requestBody.senha = data.senha;
      }
      
      const response = await fetchAuthenticated(`http://localhost:8080/adv/upd/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status !== 204) {
        throw new Error("Erro ao atualizar os dados do advogado");
      }

      console.log("Atualização bem-sucedida, sem dados retornados (204)");
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar os dados");
    }
  };

  return (
    <ComponentesFixos>
      <GridContainer>
        <LawyerPage>
          <Header>
            <input type="text" placeholder="Pesquisar advogados..." />
            <button>Adicionar</button>
          </Header>
          {advogadoData ? (
            <AdvogadoForm onSubmit={onSubmit} initialData={advogadoData} />
          ) : (
            <p>Carregando...</p>
          )}
        </LawyerPage>
      </GridContainer>
    </ComponentesFixos>
  );
}

export default AdvogadosTela;