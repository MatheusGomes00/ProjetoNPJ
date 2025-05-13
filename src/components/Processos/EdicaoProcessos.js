export const handleInputChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  export const salvarAlteracoes = async (
    formData,
    setProcesso,
    setFormData,
    setIsSaving,
    setMensagemErro,
    id,
    fetchAuthenticated
  ) => {
    if (!formData) {
      setMensagemErro("Nenhum dado de formulário disponível.");
      return;
    }
  
    // Validação de campos obrigatórios
    if (!formData.responsaveisId?.length || !formData.clienteId?.length) {
      setMensagemErro("Responsáveis e clientes não podem estar vazios.");
      return;
    }
  
    if (!formData.numeroProcesso || !formData.vara || !formData.tipoAcaoClasse) {
      setMensagemErro("Número do processo, vara e tipo de ação são obrigatórios.");
      return;
    }
  
    setIsSaving(true);
    setMensagemErro("");
    try {
      const dto = {
        situacao: formData.situacao || "INICIADO",
        numeroProcesso: formData.numeroProcesso,
        pasta: formData.pasta || null,
        tipoAcaoClasse: formData.tipoAcaoClasse,
        representanteLegal: formData.representanteLegal || null,
        requerido: formData.requerido || null,
        vara: formData.vara,
        valorCausa: formData.valorCausa || null,
        responsaveisId: formData.responsaveisId,
        responsaveisNome: formData.responsaveisNome,
        clienteId: formData.clienteId,
        clienteNome: formData.clienteNome,
      };
  
      console.log("DTO enviado para salvarAlteracoes:", JSON.stringify(dto, null, 2));
  
      const response = await fetchAuthenticated(`http://localhost:8080/proc/updProc/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na requisição: ${response.status} - ${errorData.message || "Erro desconhecido"}`);
      }
  
      const updatedProcesso = await response.json();
      console.log("Dados retornados do servidor:", JSON.stringify(updatedProcesso, null, 2));
  
      setProcesso(updatedProcesso);
      setFormData({
        numeroProcesso: updatedProcesso.numeroProcesso || "",
        pasta: updatedProcesso.pasta || "",
        tipoAcaoClasse: updatedProcesso.tipoAcaoClasse || "",
        vara: updatedProcesso.vara || "",
        valorCausa: updatedProcesso.valorCausa || "",
        representanteLegal: updatedProcesso.representanteLegal || "",
        requerido: updatedProcesso.requerido || "",
        situacao: updatedProcesso.situacao || "INICIADO",
        responsaveisId: updatedProcesso.responsaveis
          ? updatedProcesso.responsaveis.map((r) => r.id).filter(Boolean)
          : updatedProcesso.responsaveisId || [],
        responsaveisNome: updatedProcesso.responsaveis
          ? updatedProcesso.responsaveis.map((r) => r.nome).filter(Boolean)
          : updatedProcesso.responsaveisNome || [],
        clienteId: updatedProcesso.cliente
          ? updatedProcesso.cliente.map((c) => c.id).filter(Boolean)
          : updatedProcesso.clienteId || [],
        clienteNome: updatedProcesso.cliente
          ? updatedProcesso.cliente.map((c) => c.cliente?.nome || c.nome).filter(Boolean)
          : updatedProcesso.clienteNome || [],
      });
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      setMensagemErro(`Erro ao salvar alterações: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  export const adicionarResponsavel = async (
    novoResponsavelId,
    advogados,
    formData,
    setFormData,
    setProcesso,
    setShowModal,
    setNovoResponsavelId,
    setMensagemErro,
    id,
    fetchAuthenticated
  ) => {
    if (!novoResponsavelId) {
      setMensagemErro("Selecione um advogado.");
      return;
    }
  
    try {
      const novoAdvogado = advogados.find((adv) => adv.id === novoResponsavelId);
      if (!novoAdvogado) {
        throw new Error("Advogado não encontrado.");
      }
  
      const novosResponsaveisId = [...new Set([...formData.responsaveisId, novoResponsavelId])];
      const novosResponsaveisNome = [...new Set([...formData.responsaveisNome, novoAdvogado.nome])].filter(Boolean);
  
      const dto = {
        situacao: formData.situacao || "INICIADO",
        numeroProcesso: formData.numeroProcesso,
        pasta: formData.pasta || null,
        tipoAcaoClasse: formData.tipoAcaoClasse,
        representanteLegal: formData.representanteLegal || null,
        requerido: formData.requerido || null,
        vara: formData.vara,
        valorCausa: formData.valorCausa || null,
        responsaveisId: novosResponsaveisId,
        responsaveisNome: novosResponsaveisNome,
        clienteId: formData.clienteId,
        clienteNome: formData.clienteNome,
      };
  
      console.log("DTO enviado para adicionarResponsavel:", JSON.stringify(dto, null, 2));
  
      const response = await fetchAuthenticated(`http://localhost:8080/proc/updProc/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na requisição: ${response.status} - ${errorData.message || "Erro desconhecido"}`);
      }
  
      const updatedProcesso = await response.json();
      console.log("Dados retornados do servidor (adicionar):", JSON.stringify(updatedProcesso, null, 2));
  
      setProcesso(updatedProcesso);
      setFormData({
        numeroProcesso: updatedProcesso.numeroProcesso || "",
        pasta: updatedProcesso.pasta || "",
        tipoAcaoClasse: updatedProcesso.tipoAcaoClasse || "",
        vara: updatedProcesso.vara || "",
        valorCausa: updatedProcesso.valorCausa || "",
        representanteLegal: updatedProcesso.representanteLegal || "",
        requerido: updatedProcesso.requerido || "",
        situacao: updatedProcesso.situacao || "INICIADO",
        responsaveisId: updatedProcesso.responsaveis
          ? updatedProcesso.responsaveis.map((r) => r.id).filter(Boolean)
          : updatedProcesso.responsaveisId || [],
        responsaveisNome: updatedProcesso.responsaveis
          ? updatedProcesso.responsaveis.map((r) => r.nome).filter(Boolean)
          : updatedProcesso.responsaveisNome || [],
        clienteId: updatedProcesso.cliente
          ? updatedProcesso.cliente.map((c) => c.id).filter(Boolean)
          : updatedProcesso.clienteId || [],
        clienteNome: updatedProcesso.cliente
          ? updatedProcesso.cliente.map((c) => c.cliente?.nome || c.nome).filter(Boolean)
          : updatedProcesso.clienteNome || [],
      });
      setShowModal(false);
      setNovoResponsavelId("");
      setMensagemErro("");
    } catch (error) {
      console.error("Erro ao adicionar responsável:", error);
      setMensagemErro(`Erro ao adicionar responsável: ${error.message}`);
    }
  };
  
  export const removerResponsavel = async (
    responsavelId,
    formData,
    setFormData,
    setProcesso,
    setMensagemErro,
    id,
    fetchAuthenticated
  ) => {
    if (formData.responsaveisId.length <= 1) {
      setMensagemErro("O processo deve ter pelo menos um responsável.");
      return;
    }
  
    try {
      const novosResponsaveisId = formData.responsaveisId.filter((id) => id !== responsavelId);
      const novosResponsaveisNome = formData.responsaveisNome.filter(
        (_, index) => formData.responsaveisId[index] !== responsavelId
      );
  
      const dto = {
        situacao: formData.situacao || "INICIADO",
        numeroProcesso: formData.numeroProcesso,
        pasta: formData.pasta || null,
        tipoAcaoClasse: formData.tipoAcaoClasse,
        representanteLegal: formData.representanteLegal || null,
        requerido: formData.requerido || null,
        vara: formData.vara,
        valorCausa: formData.valorCausa || null,
        responsaveisId: novosResponsaveisId,
        responsaveisNome: novosResponsaveisNome,
        clienteId: formData.clienteId,
        clienteNome: formData.clienteNome,
      };
  
      console.log("DTO enviado para removerResponsavel:", JSON.stringify(dto, null, 2));
  
      const response = await fetchAuthenticated(`http://localhost:8080/proc/updProc/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na requisição: ${response.status} - ${errorData.message || "Erro desconhecido"}`);
      }
  
      const updatedProcesso = await response.json();
      console.log("Dados retornados do servidor (remover):", JSON.stringify(updatedProcesso, null, 2));
  
      setProcesso(updatedProcesso);
      setFormData({
        numeroProcesso: updatedProcesso.numeroProcesso || "",
        pasta: updatedProcesso.pasta || "",
        tipoAcaoClasse: updatedProcesso.tipoAcaoClasse || "",
        vara: updatedProcesso.vara || "",
        valorCausa: updatedProcesso.valorCausa || "",
        representanteLegal: updatedProcesso.representanteLegal || "",
        requerido: updatedProcesso.requerido || "",
        situacao: updatedProcesso.situacao || "INICIADO",
        responsaveisId: updatedProcesso.responsaveis
          ? updatedProcesso.responsaveis.map((r) => r.id).filter(Boolean)
          : updatedProcesso.responsaveisId || [],
        responsaveisNome: updatedProcesso.responsaveis
          ? updatedProcesso.responsaveis.map((r) => r.nome).filter(Boolean)
          : updatedProcesso.responsaveisNome || [],
        clienteId: updatedProcesso.cliente
          ? updatedProcesso.cliente.map((c) => c.id).filter(Boolean)
          : updatedProcesso.clienteId || [],
        clienteNome: updatedProcesso.cliente
          ? updatedProcesso.cliente.map((c) => c.cliente?.nome || c.nome).filter(Boolean)
          : updatedProcesso.clienteNome || [],
      });
      setMensagemErro("");
    } catch (error) {
      console.error("Erro ao remover responsável:", error);
      setMensagemErro(`Erro ao remover responsável: ${error.message}`);
    }
  };