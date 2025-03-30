import React, { useEffect, useState } from "react";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import { GridContainer, LawyerPage, Header } from "./AdvogadosStyles";
import AdvogadoForm from "./AdvogadosForm";


function AdvogadosTela() {
  const { fetchAuthenticated, getId, getRole } = useAuth();
  const [advogadoData, setAdvogadoData] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [formMode, setFormMode] = useState("profile");


  const id = getId();
  const role = getRole();

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

  
  const handleSearch = async (query) => {
    if (!query.trim()) return;

    const isCpfQuery = (str) => /^\d+$/.test(str);
    try {
      const url = isCpfQuery(query)
        ? `http://localhost:8080/adv/buscacpf`
        : `http://localhost:8080/adv/buscanome/${query}`;
      
      const requestBody = isCpfQuery(query)
        ? JSON.stringify({ cpf: query.toString() })
        : null;

      const response = await fetchAuthenticated(url, {
        method: isCpfQuery(query) ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      if (response.status === 404) {
        alert(isCpfQuery(query) ? "CPF não encontrado." : "Advogado não localizado.");
        setSearchResults([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const data = await response.json();
      const formattedData = Array.isArray(data) ? data : [data];

      if (formattedData.length > 1) {
        setSearchResults(formattedData);
        setSearchResult(null);
        setFormMode("profile"); // Mantém profile até selecionar
      } else if (formattedData.length === 1) {
        setSearchResult(formattedData[0]);
        setSearchResults([]);
        setFormMode(formattedData[0].id === id ? "profile" : "search");
      } else {
        alert(isCpfQuery(query) ? "CPF não encontrado." : "Advogado não localizado.");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      alert(isCpfQuery(query) ? "CPF não localizado. Tente novamente." : "Nome não encontrado. Tente novamente.");
    }
  };

  const handleSelectResult = (advogado) => {
    setSearchResult(advogado);
    setSearchResults([]);
    setFormMode(advogado.id === id ? "profile" : "search");
  };

  const onSubmit = async(data) => {
    if (!id) {
      console.error("ID do advogado não encontrado");
      return;
    }

    try {
      if (data.cpf.length !== 11) {
        alert("O CPF deve ter 11 caracteres.");
        return;
      }

      if (formMode === "create") {
        // Criação de novo advogado
        if (role !== "ADVOGADO") {
          alert("Permissão negada: apenas advogados podem cadastrar novos usuários");
          return;
        }
        const requestBody = {
          nome: data.nome,
          datanasc: data.datanasc,
          cpf: data.cpf,
          registroOab: data.registroOab || null,
          secaoOab: data.secaoOab || null,
          status: data.status,
          senha: data.senha,
          role: data.role,
        };
        const response = await fetchAuthenticated(`http://localhost:8080/adv/ins`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.status === 409) {
          alert("CPF já cadastrado.");
          return;
        }

        if (!response.ok) {
          throw new Error("Erro ao cadastrar advogado");
        }
        
        alert("Advogado cadastrado com sucesso!");
        setFormMode("profile"); // Volta ao perfil após cadastro
      } else {
        // Atualização (profile ou search)
        const targetId = formMode === "profile" ? id : searchResult.id;
        if (formMode === "search" && role !== "ADVOGADO") {
          alert("Permissão negada: apenas advogados podem editar outros cadastros");
          return;
        }
        const requestBody = {
          nome: data.nome,
          datanasc: data.datanasc,
          cpf: data.cpf,
          status: data.status,
          role: data.role,
        };
        if (data.senha && data.senha.trim() !== "") {
          requestBody.senha = data.senha;
        }
        if (data.registroOab && data.registroOab.trim() !== "") {
          requestBody.registroOab = data.registroOab;
        }
        if (data.secaoOab && data.secaoOab.trim() !== "") {
          requestBody.secaoOab = data.secaoOab;
        }

        const response = await fetchAuthenticated(`http://localhost:8080/adv/upd/${targetId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar os dados do advogado");
        }
        if (response.status !== 204) {
          const updatedData = await response.json();
          const formattedData = { ...updatedData };
          if (formMode === "profile") setAdvogadoData(formattedData);
          else setSearchResult(formattedData);
        }
        alert("Dados atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar os dados");
    }
  };

  const handleBack = () => {
    setFormMode("profile");
    setSearchResult(null);
  };

  const handleAdd = () => {
    if (role !== "ADVOGADO") {
      alert("Permissão negada: apenas advogados podem cadastrar novos usuários");
      return;
    }
    setFormMode("create");
    setSearchResult(null);
  };

  return (
    <ComponentesFixos>
      <GridContainer>
        <LawyerPage>
          <Header>
            <input 
              type="text" 
              placeholder="Pesquisar nome ou cpf..." 
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e.target.value)}
            />
            {role === "ADVOGADO" && <button onClick={handleAdd}>Adicionar</button>}
          </Header>
          {searchResults.length > 0 ? (
            <div>
              <h3>Resultados da Busca</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {searchResults.map((advogado) => (
                  <li
                    key={advogado.id}
                    onClick={() => handleSelectResult(advogado)}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ccc",
                      cursor: "pointer",
                      background: advogado.id === id ? "#e9ecef" : "transparent",
                    }}
                  >
                    {advogado.nome} - {advogado.cpf}
                  </li>
                ))}
              </ul>
            </div>
          ) : formMode === "create" ? (
            <AdvogadoForm
              onSubmit={onSubmit}
              initialData={null}
              mode="create"
              isEditable={true}
              onBack={handleBack}
              userRole={role}
            />
          ) : formMode === "search" && searchResult ? (
            <AdvogadoForm
              onSubmit={onSubmit}
              initialData={searchResult}
              mode="search"
              isEditable={role === "ADVOGADO" && searchResult.id !== id}
              onBack={handleBack}
              userRole={role}
            />
          ) : advogadoData ? (
            <AdvogadoForm
              key={formMode}
              mode={formMode}
              onSubmit={onSubmit}
              initialData={formMode === "profile" ? advogadoData : searchResult}
              isEditable={true}
              onBack={handleBack}
              userRole={role}
            />
          ) : (
            <p>Carregando...</p>
          )}
        </LawyerPage>
      </GridContainer>
    </ComponentesFixos>
  );
}

export default AdvogadosTela;