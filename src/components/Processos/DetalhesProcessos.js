import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComponentesFixos from "../ComponentesPadroes/ComponentesFixos";
import useAuth from "../Seguranca/UseAuth";
import {
  MainContainer,
  Header,
  TituloStatusContainer,
  Titulo,
  StatusBadge,
  Popup,
  BotaoVoltar,
  BotaoSalvar,
  BotaoDesassociar,
  Section,
  SectionTitle,
  InfoRow,
  InfoLabel,
  InfoValue,
  InfoInput,
  InfoSelect,
  ListItem,
  ResponsaveisTable,
  TableHeader,
  TableRow,
  TableCell,
  BotaoAcao,
  DocumentosTable,
  BotaoDownload,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  FormLabel,
  FormSelect,
  ModalButtons,
  BotaoCancelar,
  Mensagem,
  formatarSituacao,
} from "./EstilosDetalhesProcessos";
import {
  handleInputChange,
  salvarAlteracoes,
  adicionarResponsavel,
  adicionarComentario,
  removerResponsavel,
} from "./EdicaoProcessos";


const DetalhesProcesso = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAuthenticated } = useAuth();
  const [processo, setProcesso] = useState(null);
  const [formData, setFormData] = useState({
    numeroProcesso: '',
    pasta: '',
    tipoAcaoClasse: '',
    vara: '',
    valorCausa: '',
    representanteLegal: '',
    requerido: '',
    situacao: 'INICIADO', // Valor inicial fixado
    listaComentarios: [],
    responsaveisId: [],
    responsaveisNome: [],
    clienteId: [],
    clienteNome: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [advogados, setAdvogados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoResponsavelId, setNovoResponsavelId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [novoComentario, setNovoComentario] = useState('');

  // Busca os dados do processo
  const fetchProcesso = useCallback(async () => {
    setIsLoading(true);
    setMensagemErro("");
    try {
      const response = await fetchAuthenticated(`http://localhost:8080/proc/porId/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          setMensagemErro("Processo não encontrado.");
          setProcesso(null);
          return;
        }
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      const data = await response.json();
      
      setProcesso({
        ...data,
        listaComentarios: data.listaComentarios || { listaComentarios: [] }, // Normaliza ComentariosDto
      });
      setFormData({
        numeroProcesso: data.numeroProcesso || "",
        pasta: data.pasta || "",
        tipoAcaoClasse: data.tipoAcaoClasse || "",
        vara: data.vara || "",
        valorCausa: data.valorCausa || "",
        representanteLegal: data.representanteLegal || "",
        requerido: data.requerido || "",
        situacao: data.situacao || "INICIADO",
        responsaveisId: data.responsaveis
          ? data.responsaveis.map((r) => r.id).filter(Boolean)
          : data.responsaveisId || [],
        responsaveisNome: data.responsaveis
          ? data.responsaveis.map((r) => r.nome).filter(Boolean)
          : data.responsaveisNome || [],
        clienteId: data.cliente
          ? data.cliente.map((c) => c.id).filter(Boolean)
          : data.clienteId || [],
        clienteNome: data.cliente
          ? data.cliente.map((c) => c.cliente?.nome || c.nome).filter(Boolean)
          : data.clienteNome || [],
        listaComentarios: data.listaComentarios || [],
      });
    } catch (error) {
      console.error("Erro ao buscar processo:", error);
      setMensagemErro("Erro ao carregar os dados do processo. Tente novamente.");
      setProcesso(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Busca a lista de advogados
  const fetchAdvogados = useCallback(async () => {
    try {
      const response = await fetchAuthenticated(`http://localhost:8080/adv/buscarTodos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
      const data = await response.json();
      setAdvogados(data || []);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
      setMensagemErro("Erro ao carregar lista de advogados.");
    }
  }, []);

  useEffect(() => {
    fetchProcesso();
    fetchAdvogados();
  }, [id, fetchProcesso, fetchAdvogados]);

  // Renderização condicional para evitar erros durante o carregamento
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <ComponentesFixos>
      <MainContainer>
        {isLoading ? (
          <Mensagem>Carregando dados do processo...</Mensagem>
        ) : (
          <>
            <Header>
            <TituloStatusContainer>
              <Titulo>{formData.numeroProcesso || "N/A"}</Titulo>
              <StatusBadge situacao={formData.situacao}>
                {formatarSituacao(formData.situacao)}
              </StatusBadge>
            </TituloStatusContainer>
            <div style={{ display: "flex", gap: "10px" }}>
              <BotaoSalvar
                onClick={() =>
                  salvarAlteracoes(formData, setProcesso, setFormData, setIsSaving, setMensagemErro, id, fetchAuthenticated, setShowPopup,)
                }
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </BotaoSalvar>
              <BotaoVoltar onClick={() => navigate(-1)}>Voltar</BotaoVoltar>
            </div>
            </Header>
            {mensagemErro && <Mensagem erro={mensagemErro !== '' ? 'true' : 'false'}>{mensagemErro}</Mensagem>}
            {!processo ? (
              <Mensagem>Nenhum dado disponível para este processo.</Mensagem>
            ) : (
              <>
                <Section>
                  <SectionTitle>Informações do Processo</SectionTitle>
                  <InfoRow>
                    <InfoLabel htmlFor="numeroProcesso">Número do Processo *</InfoLabel>
                    <InfoInput
                      id="numeroProcesso"
                      name="numeroProcesso"
                      value={formData.numeroProcesso}
                      onChange={(e) => handleInputChange(e, setFormData)}
                      placeholder="Digite o número do processo"
                    />
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel htmlFor="tipoAcaoClasse">Tipo de Ação/Classe *</InfoLabel>
                    <InfoInput
                      id="tipoAcaoClasse"
                      name="tipoAcaoClasse"
                      value={formData.tipoAcaoClasse}
                      onChange={(e) => handleInputChange(e, setFormData)}
                      placeholder="Digite o tipo de ação/classe"
                    />
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel htmlFor="vara">Vara *</InfoLabel>
                    <InfoInput
                      id="vara"
                      name="vara"
                      value={formData.vara}
                      onChange={(e) => handleInputChange(e, setFormData)}
                      placeholder="Digite a vara"
                    />
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel htmlFor="valorCausa">Valor da Causa</InfoLabel>
                    <InfoInput
                      id="valorCausa"
                      name="valorCausa"
                      value={formData.valorCausa}
                      onChange={(e) => handleInputChange(e, setFormData)}
                      placeholder="Digite o valor da causa"
                    />
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel htmlFor="pasta">Pasta</InfoLabel>
                    <InfoInput
                      id="pasta"
                      name="pasta"
                      value={formData.pasta}
                      onChange={(e) => handleInputChange(e, setFormData)}
                      placeholder="Digite a pasta"
                    />
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel htmlFor="situacao">Situação *</InfoLabel>
                    <InfoSelect
                      id="situacao"
                      name="situacao"
                      value={formData.situacao}
                      onChange={(e) => handleInputChange(e, setFormData)}
                    >
                      {[
                        "INICIADO",
                        "EM_ANDAMENTO",
                        "FINALIZADO",
                        "ARQUIVADO",
                        "SUSPENSO",
                        "AGUARDANDO_DISTRIBUICAO",
                        "EM_RECURSO",
                      ].map((value) => (
                        <option key={value} value={value}>
                          {formatarSituacao(value)}
                        </option>
                      ))}
                    </InfoSelect>
                  </InfoRow>
                </Section>

                <Section>
                  <SectionTitle>Comentários</SectionTitle>
                  <div style={{ marginBottom: "20px" }}>
                    <InfoRow>
                      <InfoLabel htmlFor="novoComentario">Novo Comentário</InfoLabel>
                      <InfoInput
                        id="novoComentario"
                        value={novoComentario}
                        onChange={(e) => setNovoComentario(e.target.value)}
                        placeholder="Digite um comentário"
                        disabled={isLoading || isSaving}
                      />
                    </InfoRow>
                    <BotaoAcao
                      onClick={() => adicionarComentario(novoComentario, id, setMensagemErro, setIsSaving, fetchAuthenticated, setFormData, setProcesso, setNovoComentario, setShowPopup,)}
                      disabled={isLoading || isSaving || !novoComentario.trim()}
                      style={{ marginTop: "10px" }}
                    >
                      Adicionar Comentário
                    </BotaoAcao>
                  </div>
                  {Array.isArray(formData.listaComentarios) && formData.listaComentarios.length > 0 ? (
                    <ResponsaveisTable>
                      <thead>
                        <tr>
                          <TableHeader>Responsável</TableHeader>
                          <TableHeader>Data</TableHeader>
                          <TableHeader>Comentário</TableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.listaComentarios.map((objeto, index) => (
                          <TableRow key={objeto?.id || index}>
                            <TableCell>{objeto?.responsavelNome || "N/A"}</TableCell>
                            <TableCell>
                              {objeto?.dataModif
                                ? new Date(objeto.dataModif).toLocaleString("pt-BR")
                                : "N/A"}
                            </TableCell>
                            <TableCell>{objeto?.comentarios || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </ResponsaveisTable>
                  ) : (
                    <Mensagem>Nenhum comentário associado.</Mensagem>
                  )}
                </Section>

                <Section>
                  <SectionTitle>Partes Envolvidas</SectionTitle>
                  <InfoRow>
                    <InfoLabel htmlFor="representanteLegal">Representante Legal</InfoLabel>
                    <InfoInput
                      id="representanteLegal"
                      name="representanteLegal"
                      value={formData.representanteLegal}
                      onChange={(e) => handleInputChange(e, setFormData)}
                      placeholder="Digite o representante legal"
                    />
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel htmlFor="requerido">Requerido</InfoLabel>
                    <InfoInput
                      id="requerido"
                      name="requerido"
                      value={formData.requerido}
                      onChange={(e) => handleInputChange(e, setFormData)}
                      placeholder="Digite o requerido"
                    />
                  </InfoRow>
                </Section>

                <Section>
                  <SectionTitle>Cliente</SectionTitle>
                  {processo.cliente && processo.cliente.length > 0 ? (
                    processo.cliente.map((cli, index) => (
                      <ListItem key={cli?.id || index}>
                        <InfoRow>
                          <InfoLabel>Nome</InfoLabel>
                          <InfoValue>{cli.cliente?.nome || cli.nome || "N/A"}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>CPF</InfoLabel>
                          <InfoValue>{cli.cliente?.cpf || cli.cpf || "N/A"}</InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>Endereço</InfoLabel>
                          <InfoValue>
                            {cli.cliente?.endereco || cli.endereco
                              ? `${(cli.cliente?.endereco || cli.endereco).rua}, ${(cli.cliente?.endereco || cli.endereco).numero}, ${(cli.cliente?.endereco || cli.endereco).bairro}, ${(cli.cliente?.endereco || cli.endereco).cidade}`
                              : "N/A"}
                          </InfoValue>
                        </InfoRow>
                        <InfoRow>
                          <InfoLabel>Contato</InfoLabel>
                          <InfoValue>
                            {cli.cliente?.contato || cli.contato
                              ? `Tel: ${(cli.cliente?.contato || cli.contato).telefone || "N/A"}, Cel: ${(cli.cliente?.contato || cli.contato).celular || "N/A"}, Email: ${(cli.cliente?.contato || cli.contato).email || "N/A"}`
                              : "N/A"}
                          </InfoValue>
                        </InfoRow>
                      </ListItem>
                    ))
                  ) : (
                    <Mensagem>Nenhum cliente associado.</Mensagem>
                  )}
                </Section>

                <Section>
                  <SectionTitle>Responsáveis</SectionTitle>
                  <BotaoAcao onClick={() => setShowModal(true)} style={{ marginBottom: "20px" }}>
                    Adicionar Responsável
                  </BotaoAcao>
                  {processo.responsaveis && processo.responsaveis.length > 0 ? (
                    <ResponsaveisTable>
                      <thead>
                        <tr>
                          <TableHeader>Nome</TableHeader>
                          <TableHeader>OAB</TableHeader>
                          <TableHeader>CPF</TableHeader>
                          <TableHeader>Ações</TableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {processo.responsaveis.map((resp, index) => (
                          <TableRow key={resp?.id || index}>
                            <TableCell>{resp?.nome || "N/A"}</TableCell>
                            <TableCell>
                              {resp?.registroOab && resp?.secaoOab
                                ? `${resp.registroOab}/${resp.secaoOab}`
                                : "N/A"}
                            </TableCell>
                            <TableCell>{resp?.cpf || "N/A"}</TableCell>
                            <TableCell>
                              <BotaoDesassociar
                                onClick={() =>
                                  removerResponsavel(
                                    resp.id,
                                    formData,
                                    setFormData,
                                    setProcesso,
                                    setMensagemErro,
                                    id,
                                    fetchAuthenticated
                                  )
                                }
                              >
                                <span>✕</span> Desassociar
                              </BotaoDesassociar>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </ResponsaveisTable>
                  ) : (
                    <Mensagem>Nenhum responsável associado.</Mensagem>
                  )}
                </Section>

                <Section>
                  <SectionTitle>Documentos do Processo</SectionTitle>
                  {processo.documentos && processo.documentos.length > 0 ? (
                    <DocumentosTable>
                      <thead>
                        <tr>
                          <TableHeader>Nome do Documento</TableHeader>
                          <TableHeader>Tipo</TableHeader>
                          <TableHeader>Data de Upload</TableHeader>
                          <TableHeader>Ação</TableHeader>
                        </tr>
                      </thead>
                      <tbody>
                        {processo.documentos.map((doc, index) => (
                          <TableRow key={doc?.id || index}>
                            <TableCell>{doc?.nome || "N/A"}</TableCell>
                            <TableCell>{doc?.tipo || "N/A"}</TableCell>
                            <TableCell>{doc?.dataUpload || "N/A"}</TableCell>
                            <TableCell>
                              <BotaoDownload href={doc?.url || "#"} target="_blank" rel="noopener noreferrer">
                                Download
                              </BotaoDownload>
                            </TableCell>
                          </TableRow>
                        ))}
                      </tbody>
                    </DocumentosTable>
                  ) : (
                    <Mensagem>Nenhum documento associado ao processo.</Mensagem>
                  )}
                </Section>
              
                {showModal && (
                  <ModalOverlay>
                    <ModalContent>
                      <ModalTitle>Adicionar Responsável</ModalTitle>
                      <FormGroup>
                        <FormLabel>Selecione o Advogado</FormLabel>
                        <FormSelect
                          value={novoResponsavelId}
                          onChange={(e) => setNovoResponsavelId(e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          {advogados.map((adv, index) => (
                            <option key={adv?.id || index} value={adv.id}>
                              {adv.nome} ({adv.registroOab}/{adv.secaoOab})
                            </option>
                          ))}
                        </FormSelect>
                      </FormGroup>
                      <ModalButtons>
                        <BotaoCancelar onClick={() => setShowModal(false)}>Cancelar</BotaoCancelar>
                        <BotaoAcao
                          onClick={() =>
                            adicionarResponsavel(
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
                            )
                          }
                        >
                          Adicionar
                        </BotaoAcao>
                      </ModalButtons>
                    </ModalContent>
                  </ModalOverlay>
                )}
              </>
            )}
          </>
        )}
        {showPopup && <Popup>Alterações Salvas</Popup>} 
      </MainContainer>
    </ComponentesFixos>
  );
};

export default DetalhesProcesso;