import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature, faPalette, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabaseClient'; // Verifique o caminho
import './Personalizacao.css'; // Usaremos o mesmo CSS

function Personalizacao() {
  const [companyName, setCompanyName] = useState('');
  // State para as cores está de volta!
  const [colors, setColors] = useState({
    primary: '#7FA869',
    secondary: '#0F5DA4',
  });
  const [customFields, setCustomFields] = useState([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [notification, setNotification] = useState('');

  // Efeito para buscar TODAS as personalizações ao carregar
  useEffect(() => {
    async function fetchCustomizations() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Busca o nome da empresa e as cores salvas
        const { data: profileData } = await supabase
          .from('profiles')
          .select('company_name, primary_color, secondary_color')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setCompanyName(profileData.company_name || '');
          // Se houver cores salvas, usa-as. Senão, mantém as padrões.
          setColors({
            primary: profileData.primary_color || '#7FA869',
            secondary: profileData.secondary_color || '#0F5DA4',
          });
        }

        // Busca os campos personalizados
        const { data: fieldsData } = await supabase.from('custom_fields').select('*').eq('user_id', user.id);
        if (fieldsData) setCustomFields(fieldsData);
      }
    }
    fetchCustomizations();
  }, []);

  // Efeito para APLICAR as cores dinamicamente na interface
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
  }, [colors]);


  const handleColorChange = (e) => {
    setColors({ ...colors, [e.target.id]: e.target.value });
  };

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

  // Salva TODAS as alterações (nome da empresa E cores)
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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
    }
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <section className="section active" id="personalizacao">
      {notification && <div className="notification success show">{notification}</div>}

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
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            {/* Seção das Cores */}
            <div className="form-group-full">
              <label>Cores do Tema</label>
              <div className="color-picker-group">
                <div className="color-item">
                  <label htmlFor="primary">Primária</label>
                  <div className="color-input-wrapper">
                    <input type="color" id="primary" value={colors.primary} onChange={handleColorChange} />
                  </div>
                </div>
                <div className="color-item">
                  <label htmlFor="secondary">Secundária</label>
                  <div className="color-input-wrapper">
                    <input type="color" id="secondary" value={colors.secondary} onChange={handleColorChange} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card para Campos Personalizados */}
        <div className="customization-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faPlus} className="icon" />
            <h3>Campos de Cadastro Personalizados</h3>
          </div>
          <div className="add-field-form">
            <input 
              type="text" 
              className="company-name-input" /* Reutilizando o estilo */
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

        <button type="submit" className="btn-submit-personalizacao">Salvar Alterações Gerais</button>
      </form>
    </section>
  );
}

export default Personalizacao;