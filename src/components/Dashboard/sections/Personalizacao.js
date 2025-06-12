import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature, faPalette, faPlus, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabaseClient';
import { useProfile } from '../../../context/ProfileContext'; // 1. Importa o hook do contexto
import './Personalizacao.css';

function Personalizacao() {
  // 2. Puxa os dados e funções do contexto, em vez de usar o estado local para eles
  const { companyName, setCompanyName, colors, setColors, refreshProfile } = useProfile();
  
  // O estado local agora é usado apenas para o que é específico deste componente
  const [customFields, setCustomFields] = useState([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [notification, setNotification] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Efeito para buscar apenas os campos personalizados.
  // O nome e as cores já são gerenciados pelo ProfileContext.
  useEffect(() => {
    async function fetchCustomFields() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: fieldsData } = await supabase.from('custom_fields').select('*').eq('user_id', user.id);
        if (fieldsData) setCustomFields(fieldsData);
      }
    }
    fetchCustomFields();
  }, []);

  // Funções para adicionar e deletar campos continuam as mesmas
  const handleAddField = async () => {
    if (newFieldLabel.trim() === '') return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const newField = { user_id: user.id, field_label: newFieldLabel };
    const { data, error } = await supabase.from('custom_fields').insert(newField).select().single();
    if (error) console.error('Erro ao adicionar campo:', error);
    else {
      setCustomFields([...customFields, data]);
      setNewFieldLabel('');
    }
  };

  const handleDeleteField = async (fieldId) => {
    const { error } = await supabase.from('custom_fields').delete().eq('id', fieldId);
    if (error) console.error('Erro ao deletar campo:', error);
    else setCustomFields(customFields.filter(field => field.id !== fieldId));
  };
  
  // 3. Função de salvar agora atualiza o Supabase e depois o contexto global
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setIsSaving(false);
        return;
    };

    const profileUpdates = {
      company_name: companyName,
      primary_color: colors.primary,
      secondary_color: colors.secondary,
    };

    const { error } = await supabase.from('profiles').update(profileUpdates).eq('id', user.id);
    
    if (error) {
      setNotification('Erro ao salvar as alterações.');
      console.error("Erro ao salvar:", error);
    } else {
      setNotification('Alterações salvas com sucesso!');
      await refreshProfile(); // Recarrega os dados do perfil em toda a aplicação
    }
    
    setIsSaving(false);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <section className="section active" id="personalizacao">
      {notification && <div className={`notification success show`}>{notification}</div>}

      <form className="personalizacao-container" onSubmit={handleSaveChanges}>
        
        {/* Card para Branding: Nome e Cores */}
        <div className="customization-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faSignature} className="icon" />
            <h3>Identidade Visual</h3>
          </div>
          <div className="card-body" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
            {/* Seção do Nome */}
            <div className="form-group-full">
              <label>Nome da Empresa/Evento</label>
              <input 
                type="text" 
                className="company-name-input"
                placeholder="Digite o nome que aparecerá no cabeçalho"
                value={companyName} // 4. Valor vem do contexto
                onChange={(e) => setCompanyName(e.target.value)} // Atualiza o valor no contexto
              />
            </div>
            {/* Seção das Cores */}
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

        {/* Card para Campos Personalizados (lógica interna não muda) */}
        <div className="customization-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faPlus} className="icon" />
            <h3>Campos de Cadastro Personalizados</h3>
          </div>
          <div className="add-field-form">
            <input 
              type="text" 
              className="company-name-input"
              placeholder="Nome do novo campo (ex: Tamanho da Camiseta)"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
            />
            <button type="button" className="btn-action" onClick={handleAddField}>Adicionar Campo</button>
          </div>
          <div className="custom-fields-list">
            {customFields.map(field => (
              <div key={field.id} className="custom-field-item">
                <span>{field.field_label}</span>
                <button type="button" className="btn-delete-field" onClick={() => handleDeleteField(field.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-submit-personalizacao" disabled={isSaving}>
          {isSaving ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Salvar Alterações Gerais'}
        </button>
      </form>
    </section>
  );
}

export default Personalizacao;
