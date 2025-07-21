import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  InfoRow,
  InfoLabel,
  InfoInput,
  BotaoAcao,
  Mensagem,
  Section
} from "./EstilosDetalhesProcessos";
import {
  Card,  
  CardContent,
  CardPreview,
  Modal,
  ModalContent,
  ModalActions,
} from "./EstilosComentarios"
import {  adicionarComentario,  editarComentario,  excluirComentario } from "./EdicaoProcessos";
import useAuth from "../Seguranca/UseAuth";
import { useAuthContext } from '../Seguranca/AuthContext';

// Estilizar SectionTitle com interatividade
const SectionTitle = styled.h3`
  font-family: "Arial", sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
`;

const ToggleIcon = styled.span`
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  transform: ${({ $isCollapsed }) => ($isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)')};
`;

const ContentWrapper = styled.div`
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
  max-height: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '1000px')}; /* Ajustar conforme conteúdo */
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '1')};
`

const Comentarios = ({
  idProc,
  isLoading,
  isSaving,
  setIsSaving,
  formData,
  setFormData,
  setMensagemErro,
  setShowPopup, // ID do usuário logado para verificar permissões
}) => {
  // Estados para o modal
  const [modalAberto, setModalAberto] = useState(false);
  const [comentarioSelecionado, setComentarioSelecionado] = useState(null);
  const [editando, setEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState('');
  const { fetchAuthenticated, getId } = useAuth();
  const userId = getId();
  const [novoComentario, setNovoComentario] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSessionInvalid } = useAuthContext();

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Função auxiliar para limitar prévia a 50 palavras
  const getPreview = (text) => {
    if (!text) return 'N/A';
    const words = text.split(' ');
    return words.length > 50 ? `${words.slice(0, 50).join(' ')}...` : text;
  };

  // Abrir modal ao clicar no cartão
  const abrirModal = useCallback((comentario) => {
    setComentarioSelecionado(comentario);
    setTextoEditado(comentario?.comentarios || '');
    setModalAberto(true);
    setEditando(false);
  }, []);

  // Fechar modal
  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setComentarioSelecionado(null);
    setTextoEditado('');
    setEditando(false);
  }, []);

  // Alternar modo de edição
  const iniciarEdicao = useCallback(() => {
    if (userId === comentarioSelecionado?.responsavelId) {
      setEditando(true);
    } else {
      setMensagemErro('Você não tem permissão para editar este comentário.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  }, [userId, comentarioSelecionado, setMensagemErro, setShowPopup]);

  // Salvar alterações
  const salvarEdicao = useCallback(async () => {
    if (!textoEditado.trim()) {
      setMensagemErro('O comentário não pode estar vazio.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    try {
      await editarComentario(
        idProc,
        comentarioSelecionado.id,
        textoEditado,
        setMensagemErro,
        setIsSaving,
        fetchAuthenticated,
        setFormData,
        setNovoComentario,
        setShowPopup
      );
      
      fecharModal();
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      setMensagemErro(`Erro ao salvar comentário: ${error.message}`);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  }, [
    idProc,
    comentarioSelecionado,
    textoEditado,
    setMensagemErro,
    fetchAuthenticated,
    setIsSaving,
    setFormData,
    setNovoComentario,
    setShowPopup,
    fecharModal,
  ]);

  const handleExcluirComentario = useCallback(async () => {
    if (userId !== comentarioSelecionado?.responsavelId) {
      setMensagemErro('Você não tem permissão para excluir este comentário.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }
    try {
      await excluirComentario(idProc, comentarioSelecionado.id, setMensagemErro, setIsSaving, fetchAuthenticated, setFormData, setShowPopup,);
      fecharModal();
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      setMensagemErro(`Erro ao excluir comentário: ${error.message}`);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  }, [userId, comentarioSelecionado, fetchAuthenticated, setFormData, setIsSaving, idProc, setMensagemErro, setShowPopup, fecharModal]);

  // Fechar modal com tecla Esc
  useEffect(() => {
    if (isSessionInvalid) return; // Verifica se a sessão é inválida
    const handleEsc = (event) => {
      if (event.key === 'Escape' && modalAberto) {
        fecharModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [modalAberto, fecharModal, isSessionInvalid]);

  return (
    <Section>
      <SectionTitle
        onClick={toggleCollapse}
        role="button"
        aria-expanded={!isCollapsed}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleCollapse()}
      >
        <ToggleIcon $isCollapsed={isCollapsed}>▶</ToggleIcon>
        Comentários
      </SectionTitle>
      <ContentWrapper $isCollapsed={isCollapsed}>
        <div style={{ marginBottom: '20px' }}>
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
            onClick={() =>
              adicionarComentario(
                novoComentario,
                idProc,
                setMensagemErro,
                setIsSaving,
                fetchAuthenticated,
                setFormData,
                setNovoComentario,
                setShowPopup
              )
            }
            disabled={isLoading || isSaving || !novoComentario.trim()}
            style={{ marginTop: '10px' }}
          >
            Adicionar Comentário
          </BotaoAcao>
        </div>
        {Array.isArray(formData.listaComentarios) && formData.listaComentarios.length > 0 ? (
          <div>
            {formData.listaComentarios.map((objeto, index) => (
              <Card key={objeto?.id || index} onClick={() => abrirModal(objeto)} tabIndex={0}>
                <CardContent>
                  <div>{objeto?.responsavelNome || 'N/A'}</div>
                  <div>
                    {objeto?.dataModif
                      ? new Date(objeto.dataModif).toLocaleString('pt-BR')
                      : 'N/A'}
                  </div>
                  <CardPreview>{getPreview(objeto?.comentarios)}</CardPreview>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Mensagem>Nenhum comentário associado.</Mensagem>
        )}
        {modalAberto && comentarioSelecionado && (
          <Modal>
            <ModalContent>
              <h3>Comentário</h3>
              <InfoInput
                as="textarea"
                value={textoEditado}
                onChange={(e) => setTextoEditado(e.target.value)}
                placeholder="Digite o comentário"
                disabled={!editando || isSaving}
                style={{ width: '100%', minHeight: '100px' }}
              />
              <ModalActions>
                <BotaoAcao onClick={fecharModal}>Fechar</BotaoAcao>
                {userId === comentarioSelecionado?.responsavelId && (
                  <>
                    {!editando && (
                      <BotaoAcao onClick={iniciarEdicao} style={{ marginLeft: '10px' }}>
                        Editar
                      </BotaoAcao>
                    )}
                    {editando && (
                      <BotaoAcao
                        onClick={salvarEdicao}
                        style={{ marginLeft: '10px' }}
                        disabled={isSaving || !textoEditado.trim()}
                      >
                        Salvar
                      </BotaoAcao>
                    )}
                    <BotaoAcao
                      onClick={handleExcluirComentario}
                      style={{ marginLeft: '10px' }}
                      disabled={isSaving}
                    >
                      Excluir
                    </BotaoAcao>
                  </>
                )}
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </ContentWrapper>
    </Section>
  );
};

export default Comentarios;