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
  fetchAuthenticated,
  setShowPopup,
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

  if(!formData.situacao) {
      setMensagemErro("O campo situação é obrigatório.");
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
      listaComentarios: formData.listaComentarios
    };

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
      listaComentarios: updatedProcesso.listaComentarios || [],
    });
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
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

export const adicionarComentario = async (
  novoComentario, 
  idProc,
  setMensagemErro, 
  setIsSaving, 
  fetchAuthenticated, 
  setFormData,
  setNovoComentario, 
  setShowPopup,
  ) => {
    if (!novoComentario.trim()) {
      setMensagemErro('O comentário não pode estar vazio.');
      return;
    }

    setIsSaving(true);
    setMensagemErro('');
    try {
      const comentarioData = {
        dataModif: new Date().toISOString(),
        comentarios: novoComentario,
      };

      const response = await fetchAuthenticated(`http://localhost:8080/proc/${idProc}/add-comentario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      
      setFormData((prev) => ({...prev, listaComentarios: [...(prev.listaComentarios || []), data] }));

      setNovoComentario('');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000); // Fecha o popup após 2 segundos
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      setMensagemErro('Erro ao salvar o comentário. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
};

export const editarComentario = async ( 
  idProc,comentarioId, textoEditado, setMensagemErro, setIsSaving, fetchAuthenticated, setFormData, setNovoComentario, setShowPopup
  ) => {
    if (!idProc || !textoEditado.trim() || !comentarioId) {
      setMensagemErro('ID do processo, ID do comentário e texto são obrigatórios');
      return;
    }

    const comentarioData = {
        dataModif: new Date().toISOString(),
        comentarios: textoEditado,
      };
    
    setIsSaving(true);
    setMensagemErro('');

    try {
      const response = await fetchAuthenticated(`http://localhost:8080/proc/${idProc}/upd-comentario/${comentarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      
      setFormData((prev) => ({
        ...prev,
        listaComentarios: (prev.listaComentarios || []).map((item) =>
          item.id === comentarioId ? { ...item, ...data } : item
        ),
      }));
      setNovoComentario('');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000); // Fecha o popup após 2 segundos
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      setMensagemErro('Erro ao salvar o comentário. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
};

export const excluirComentario = async ( 
  idProc, comentarioId, setMensagemErro, setIsSaving, fetchAuthenticated, setFormData, setShowPopup
) => {
  if (!idProc || !comentarioId) {
    setMensagemErro('ID do processo e ID do comentário são obrigatórios');
    return;
  }

  setIsSaving(true);
  setMensagemErro('');

  try {
    const response = await fetchAuthenticated(
      `http://localhost:8080/proc/${idProc}/del-comentario`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: comentarioId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    // Atualizar listaComentarios localmente, removendo o comentário
    setFormData((prev) => ({
      ...prev,
      listaComentarios: (prev.listaComentarios || []).filter(
        (item) => item.id !== comentarioId
      ),
    }));

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000); // Fecha o popup após 2 segundos
  } catch (error) {
    console.error('Erro ao excluir comentário:', error);
    setMensagemErro('Erro ao excluir o comentário. Tente novamente.');
  } finally {
    setIsSaving(false);
  }
};