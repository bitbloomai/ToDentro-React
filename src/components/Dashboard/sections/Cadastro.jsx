import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faShareAlt, faSave, faEdit, faTrash, faSpinner, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabaseClient'; // Verifique se o caminho está correto
import './Cadastro.css'; // Não se esqueça de importar o CSS
import '../Dashboard.css';

// Componente para o modal de confirmação
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <p>{message}</p>
      <div className="modal-actions">
        <button onClick={onCancel} className="btn-cancel">Cancelar</button>
        <button onClick={onConfirm} className="btn-delete">Confirmar</button>
      </div>
    </div>
  </div>
);

// Componente para a notificação
const Notification = ({ message, type, show }) => {
    if (!show) return null;
    return <div className={`notification ${type} show`}>{message}</div>;
};

function Cadastro() {
  // --- STATE MANAGEMENT ---
  const [people, setPeople] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [modal, setModal] = useState({ isOpen: false, message: '', onConfirm: null });

  // --- ESTADOS PARA O LINK DE CADASTRO ---
  const [registrationLink, setRegistrationLink] = useState('');
  const linkInputRef = useRef(null);
  const [user, setUser] = useState(null); // Estado para armazenar o usuário

  // --- HELPER FUNCTIONS ---
  const resetForm = () => {
    const initialFormState = { nome: '', email: '', telefone: '' };
    customFields.forEach(field => {
      initialFormState[field.field_label] = '';
    });
    setFormData(initialFormState);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // --- DATA FETCHING (LÓGICA CORRIGIDA) ---
  useEffect(() => {
    setIsLoading(true);

    // Usamos onAuthStateChange para obter o usuário e ouvir mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser); // <<-- CORREÇÃO PRINCIPAL: Atualiza o estado do usuário

        if (currentUser) {
            // Busca os dados apenas se houver um usuário logado
            const { data: fieldsData, error: fieldsError } = await supabase
                .from('custom_fields')
                .select('*')
                .eq('user_id', currentUser.id);
            
            if (fieldsError) {
                console.error('Erro ao buscar campos personalizados:', fieldsError);
                showNotification('Falha ao carregar campos personalizados.', 'error');
            } else {
                setCustomFields(fieldsData || []);
            }

            const { data: peopleData, error: peopleError } = await supabase
                .from('registrations')
                .select('*')
                .eq('user_id', currentUser.id);
                
            if (peopleError) {
                console.error('Erro ao buscar pessoas cadastradas:', peopleError);
                showNotification('Falha ao carregar pessoas cadastradas.', 'error');
            } else {
                setPeople(peopleData || []);
            }
        } else {
            // Limpa os dados se o usuário fizer logout
            setCustomFields([]);
            setPeople([]);
        }
        setIsLoading(false);
    });

    // Limpa a inscrição ao desmontar o componente para evitar vazamentos de memória
    return () => {
        subscription?.unsubscribe();
    };
  }, []); // O array vazio garante que isso rode apenas uma vez na montagem

  // Reseta o formulário quando os campos personalizados são carregados
  useEffect(() => {
    resetForm();
  }, [customFields]);


  // --- EVENT HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Re-valida o usuário no momento do envio por segurança
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
        showNotification('Você precisa estar logado para cadastrar.', 'error');
        setIsSubmitting(false);
        return;
    }

    const standardData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
    };
    const customData = {};
    customFields.forEach(field => {
        if(formData[field.field_label]){
            customData[field.field_label] = formData[field.field_label];
        }
    });

    const newRegistration = {
        user_id: currentUser.id,
        ...standardData,
        custom_data: customData
    };

    const { data, error } = await supabase
      .from('registrations')
      .insert(newRegistration)
      .select()
      .single();

    if (error) {
        console.error('Erro ao cadastrar pessoa:', error);
        showNotification('Erro ao salvar o cadastro. Tente novamente.', 'error');
    } else {
        setPeople(prev => [...prev, data]);
        showNotification('Pessoa cadastrada com sucesso!');
        resetForm();
    }
    setIsSubmitting(false);
  };

  const openDeleteModal = (personId) => {
    setModal({
      isOpen: true,
      message: 'Tem certeza que deseja remover esta pessoa?',
      onConfirm: () => handleDelete(personId)
    });
  };

  const handleDelete = async (personId) => {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', personId);
    
    if (error) {
      console.error('Erro ao deletar pessoa:', error);
      showNotification('Erro ao remover a pessoa.', 'error');
    } else {
      setPeople(people.filter(p => p.id !== personId));
      showNotification('Pessoa removida com sucesso.');
    }
    setModal({ isOpen: false, message: '', onConfirm: null });
  };

  // --- FUNÇÕES PARA O LINK (Agora funcionará corretamente) ---
  const generateRegistrationLink = () => {
      if (user && user.id) { // Verifica se o objeto user e seu id existem
          const link = `${window.location.origin}/register-public/${user.id}`;
          setRegistrationLink(link);
      } else {
          showNotification('Usuário não encontrado. Faça login novamente.', 'error');
      }
  };

  const copyLinkToClipboard = () => {
      if(linkInputRef.current) {
        linkInputRef.current.select();
        document.execCommand('copy');
        showNotification('Link copiado para a área de transferência!');
      }
  };

  // --- FUNÇÃO DE EXPORTAÇÃO ---
  const handleExportCSV = () => {
    if (people.length === 0) {
        showNotification("Não há dados para exportar.", "error");
        return;
    }

    const standardHeaders = ['Nome', 'Email', 'Telefone'];
    const customHeaders = customFields.map(field => field.field_label);
    const headers = [...standardHeaders, ...customHeaders];
    
    const csvContent = [
        headers.join(','),
        ...people.map(person => {
            const standardValues = [
                `"${person.nome || ''}"`,
                `"${person.email || ''}"`,
                `"${person.telefone || ''}"`
            ];
            const customValues = customHeaders.map(header => {
                const value = person.custom_data ? person.custom_data[header] || '' : '';
                return `"${value}"`;
            });

            return [...standardValues, ...customValues].join(',');
        })
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // Adicionado BOM para compatibilidade com Excel
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        const date = new Date().toISOString().slice(0, 10);
        link.setAttribute("href", url);
        link.setAttribute("download", `cadastros_${date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    showNotification("Exportação concluída!");
  };


  // --- RENDER ---
  if (isLoading) {
    return (
      <section className="section active" id="cadastro-loading">
        <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            <p>Carregando dados...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section active" id="cadastro">
      <Notification 
        show={notification.show} 
        message={notification.message} 
        type={notification.type} 
      />
      {modal.isOpen && (
        <ConfirmationModal 
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal({ isOpen: false })}
        />
      )}

      <h2> Cadastro de Pessoas</h2>
      
      <form className="cadastro-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input type="text" id="nome" name="nome" value={formData.nome || ''} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input type="tel" id="telefone" name="telefone" value={formData.telefone || ''} onChange={handleInputChange} />
          </div>
          {customFields.length > 0 && (
             <div className="form-group">
                <label htmlFor={customFields[0].field_label}>{customFields[0].field_label}</label>
                <input 
                    type="text" 
                    id={customFields[0].field_label} 
                    name={customFields[0].field_label} 
                    value={formData[customFields[0].field_label] || ''} 
                    onChange={handleInputChange} 
                />
            </div>
          )}
        </div>

        {customFields.slice(1).map((field, index) => (
             <div className="form-row" key={field.id}>
                <div className="form-group">
                    <label htmlFor={field.field_label}>{field.field_label}</label>
                    <input 
                        type="text" 
                        id={field.field_label}
                        name={field.field_label} 
                        value={formData[field.field_label] || ''} 
                        onChange={handleInputChange} 
                    />
                </div>
                {/* Garante que a linha sempre tenha dois elementos para manter o layout */}
                {customFields.slice(1)[index+1] ? null : <div className="form-group"></div>}
            </div>
        ))}
        
        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          <FontAwesomeIcon icon={isSubmitting ? faSpinner : faSave} spin={isSubmitting} /> {isSubmitting ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>

      <div className="link-generator-card">
          <h3>Link de Cadastro Público</h3>
          <p>Gere um link para que seus convidados possam se cadastrar sozinhos.</p>
          <button className="btn-generate-link" onClick={generateRegistrationLink}>
              <FontAwesomeIcon icon={faShareAlt} /> Gerar Link
          </button>
          {registrationLink && (
              <div className="link-display">
                  <input ref={linkInputRef} type="text" value={registrationLink} readOnly />
                  <button className="btn-copy" onClick={copyLinkToClipboard} title="Copiar link">
                      <FontAwesomeIcon icon={faCopy} />
                  </button>
              </div>
          )}
      </div>

      <div className="registered-people">
        <div className="registered-people-header">
            <h3>Pessoas Cadastradas</h3>
            <button className="btn-export" onClick={handleExportCSV} title="Exportar para CSV">
                <FontAwesomeIcon icon={faFileCsv} />
                Exportar CSV
            </button>
        </div>
        <div className="people-table-container">
            <div className="people-table" style={{'--num-columns': 4 + customFields.length}}>
                <div className="person-row header">
                    <div>Nome</div>
                    <div>Email</div>
                    <div>Telefone</div>
                    {customFields.map(field => <div key={field.id}>{field.field_label}</div>)}
                    <div>Ações</div>
                </div>
                {people.length > 0 ? people.map(person => (
                <div key={person.id} className="person-row">
                    <div>{person.nome}</div>
                    <div>{person.email}</div>
                    <div>{person.telefone}</div>
                    {customFields.map(field => (
                        <div key={field.id}>
                            {person.custom_data ? person.custom_data[field.field_label] || '-' : '-'}
                        </div>
                    ))}
                    <div className="actions">
                        <button className="btn-edit" title="Editar (funcionalidade a implementar)">
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="btn-delete" onClick={() => openDeleteModal(person.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
                )) : (
                <div className="empty-state">Nenhuma pessoa cadastrada.</div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
}

export default Cadastro;
