import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature, faPalette, faUserPlus, faPlus, faTrash, faSpinner, faAddressBook } from '@fortawesome/free-solid-svg-icons'; // Adicionado faUserPlus e faAddressBook
import { supabase } from '../../../supabaseClient';
import { useProfile } from '../../../context/ProfileContext';
import './Personalizacao.css'; // Não se esqueça de importar o CSS

// Componente de Notificação reutilizável para feedback ao usuário
const Notification = ({ message, type }) => (
  <div className={`notification ${type} show`}>
    {message}
  </div>
);

function Personalizacao() {
  const { companyName, setCompanyName, colors, setColors, refreshProfile } = useProfile();
  
  // customFields para cadastros (padrão) e visitorCustomFields para visitantes rápidos
  const [registrationCustomFields, setRegistrationCustomFields] = useState([]);
  const [visitorCustomFields, setVisitorCustomFields] = useState([]);
  
  const [newRegistrationFieldLabel, setNewRegistrationFieldLabel] = useState('');
  const [newVisitorFieldLabel, setNewVisitorFieldLabel] = useState(''); // Novo estado para campos de visitante
  
  const [notification, setNotification] = useState({ show: false, message: '', type: '' }); // Alterado para objeto
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFields, setIsLoadingFields] = useState(true); // Novo estado de loading para campos

  // Helper para exibir notificações
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Efeito para buscar campos personalizados de ambos os tipos
  useEffect(() => {
    async function fetchCustomFields() {
      setIsLoadingFields(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Busca campos de tipo 'registration'
        const { data: registrationFieldsData, error: regError } = await supabase
          .from('custom_fields')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'registration');
        
        if (regError) {
          console.error('Erro ao buscar campos de cadastro:', regError);
          showNotification('Falha ao carregar campos de cadastro.', 'error');
        } else {
          setRegistrationCustomFields(registrationFieldsData || []);
        }

        // Busca campos de tipo 'visitor'
        const { data: visitorFieldsData, error: visError } = await supabase
          .from('custom_fields')
          .select('*')
          .eq('user_id', user.id)
          .eq('type', 'visitor'); // Filtra por tipo 'visitor'
        
        if (visError) {
          console.error('Erro ao buscar campos de visitante:', visError);
          showNotification('Falha ao carregar campos de visitante.', 'error');
        } else {
          setVisitorCustomFields(visitorFieldsData || []);
        }
      }
      setIsLoadingFields(false);
    }
    fetchCustomFields();
  }, []);

  // Função genérica para adicionar campo
  const handleAddField = async (fieldLabel, fieldType, setFieldLabelState, setFieldsState) => {
    if (fieldLabel.trim() === '') {
      showNotification('O nome do campo não pode ser vazio.', 'error');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showNotification('Você precisa estar logado para adicionar campos.', 'error');
      return;
    }

    const newField = { user_id: user.id, field_label: fieldLabel, type: fieldType };
    const { data, error } = await supabase.from('custom_fields').insert(newField).select().single();
    if (error) {
      console.error('Erro ao adicionar campo:', error);
      showNotification('Erro ao adicionar campo. Tente novamente.', 'error');
    } else {
      setFieldsState(prev => [...prev, data]);
      setFieldLabelState('');
      showNotification(`Campo "${fieldLabel}" adicionado com sucesso!`, 'success');
    }
  };

  // Função genérica para deletar campo
  const handleDeleteField = async (fieldId, setFieldsState) => {
    const { error } = await supabase.from('custom_fields').delete().eq('id', fieldId);
    if (error) {
      console.error('Erro ao deletar campo:', error);
      showNotification('Erro ao remover campo. Tente novamente.', 'error');
    } else {
      setFieldsState(prev => prev.filter(field => field.id !== fieldId));
      showNotification('Campo removido com sucesso.', 'success');
    }
  };
  
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setIsSaving(false);
        showNotification('Você precisa estar logado para salvar.', 'error');
        return;
    };

    const profileUpdates = {
      company_name: companyName,
      primary_color: colors.primary,
      secondary_color: colors.secondary,
    };

    const { error } = await supabase.from('profiles').update(profileUpdates).eq('id', user.id);
    
    if (error) {
      showNotification('Erro ao salvar as alterações gerais.', 'error');
      console.error("Erro ao salvar:", error);
    } else {
      showNotification('Alterações gerais salvas com sucesso!', 'success');
      await refreshProfile();
    }
    
    setIsSaving(false);
  };

  return (
    <section className="section active" id="personalizacao">
      {notification.show && <Notification message={notification.message} type={notification.type} />}

      <form className="personalizacao-container" onSubmit={handleSaveChanges}>
        
        {/* Card para Branding: Nome e Cores */}
        <div className="customization-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faSignature} className="icon" />
            <h3>Identidade Visual</h3>
          </div>
          <div className="card-body" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            <div className="form-group-full">
              <label htmlFor="company-name">Nome da Empresa/Evento</label>
              <input 
                type="text" 
                id="company-name"
                className="company-name-input"
                placeholder="Digite o nome que aparecerá no cabeçalho"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="form-group-full">
              <label>Cores do Tema</label>
              <div className="color-picker-group">
                <div className="color-item">
                  <label htmlFor="primary">Primária</label>
                  <div className="color-input-wrapper">
                    <input type="color" id="primary" value={colors.primary} onChange={(e) => setColors({...colors, primary: e.target.value})} />
                  </div>
                </div>
                <div className="color-item">
                  <label htmlFor="secondary">Secundária</label>
                  <div className="color-input-wrapper">
                    <input type="color" id="secondary" value={colors.secondary} onChange={(e) => setColors({...colors, secondary: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card para Campos de Cadastro Padrão */}
        <div className="customization-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faAddressBook} className="icon" /> {/* Ícone alterado para diferenciar */}
            <h3>Campos de Cadastro Geral</h3>
          </div>
          {isLoadingFields ? (
            <div className="loading-fields">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
              <p>Carregando campos de cadastro...</p>
            </div>
          ) : (
            <>
              <div className="add-field-form">
                <input 
                  type="text" 
                  className="company-name-input"
                  placeholder="Nome do novo campo (ex: Tamanho da Camiseta)"
                  value={newRegistrationFieldLabel}
                  onChange={(e) => setNewRegistrationFieldLabel(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn-action" 
                  onClick={() => handleAddField(newRegistrationFieldLabel, 'registration', setNewRegistrationFieldLabel, setRegistrationCustomFields)}
                >
                  <FontAwesomeIcon icon={faPlus} /> Adicionar
                </button>
              </div>
              <div className="custom-fields-list">
                {registrationCustomFields.length > 0 ? (
                  registrationCustomFields.map(field => (
                    <div key={field.id} className="custom-field-item">
                      <span>{field.field_label}</span>
                      <button type="button" className="btn-delete-field" onClick={() => handleDeleteField(field.id, setRegistrationCustomFields)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-fields">Nenhum campo de cadastro personalizado.</div>
                )}
              </div>
            </>
          )}
        </div>

        {/* NOVO CARD: Campos de Visitante Rápido */}
        <div className="customization-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faUserPlus} className="icon" /> {/* Ícone para visitantes */}
            <h3>Campos de Visitante Rápido</h3>
          </div>
          {isLoadingFields ? (
            <div className="loading-fields">
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
              <p>Carregando campos de visitante...</p>
            </div>
          ) : (
            <>
              <div className="add-field-form">
                <input 
                  type="text" 
                  className="company-name-input"
                  placeholder="Nome do novo campo para visitante (ex: Crachá)"
                  value={newVisitorFieldLabel}
                  onChange={(e) => setNewVisitorFieldLabel(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn-action" 
                  onClick={() => handleAddField(newVisitorFieldLabel, 'visitor', setNewVisitorFieldLabel, setVisitorCustomFields)}
                >
                  <FontAwesomeIcon icon={faPlus} /> Adicionar
                </button>
              </div>
              <div className="custom-fields-list">
                {visitorCustomFields.length > 0 ? (
                  visitorCustomFields.map(field => (
                    <div key={field.id} className="custom-field-item">
                      <span>{field.field_label}</span>
                      <button type="button" className="btn-delete-field" onClick={() => handleDeleteField(field.id, setVisitorCustomFields)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-fields">Nenhum campo de visitante personalizado.</div>
                )}
              </div>
            </>
          )}
        </div>

        <button type="submit" className="btn-submit-personalizacao" disabled={isSaving}>
          {isSaving ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Salvar Alterações Gerais'}
        </button>
      </form>
    </section>
  );
}

export default Personalizacao;
