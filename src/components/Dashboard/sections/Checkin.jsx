import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faSpinner, faCheckCircle, faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons'; // Adicionado faTimes para o botão de fechar modal
import { supabase } from '../../../supabaseClient';
import './Checkin.css'; // Importe o CSS para estilização

// Componente de Notificação reutilizável para feedback ao usuário
const Notification = ({ message, type }) => (
  <div className={`notification ${type} show`}>
    {message}
  </div>
);

// Novo Componente para o Modal de Adicionar Visitante Rápido
const AddVisitorModal = ({ isOpen, onClose, onSubmit, visitorCustomFields, showNotification }) => {
  const [newVisitorData, setNewVisitorData] = useState({ nome: '', custom_data: {} });
  const [isSubmittingVisitor, setIsSubmittingVisitor] = useState(false);

  // Resetar o formulário quando o modal é aberto ou fechado
  useEffect(() => {
    if (isOpen) {
      setNewVisitorData({ nome: '', custom_data: {} });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nome') {
      setNewVisitorData(prev => ({ ...prev, nome: value }));
    } else {
      setNewVisitorData(prev => ({
        ...prev,
        custom_data: {
          ...prev.custom_data,
          [name]: value
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingVisitor) return;

    if (newVisitorData.nome.trim() === '') {
      showNotification('O nome do visitante é obrigatório.', 'error');
      return;
    }

    setIsSubmittingVisitor(true);
    await onSubmit(newVisitorData);
    setIsSubmittingVisitor(false);
    onClose(); // Fechar o modal após submeter
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Adicionar Novo Visitante</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-visitor-form">
          <div className="form-group">
            <label htmlFor="visitor-name">Nome do Visitante <span className="required">*</span></label>
            <input
              type="text"
              id="visitor-name"
              name="nome"
              value={newVisitorData.nome}
              onChange={handleInputChange}
              required
              className="visitor-input"
              placeholder="Nome completo do visitante"
            />
          </div>

          {visitorCustomFields.map(field => (
            <div className="form-group" key={field.id}>
              <label htmlFor={`visitor-${field.field_label}`}>{field.field_label}</label>
              <input
                type="text"
                id={`visitor-${field.field_label}`}
                name={field.field_label}
                value={newVisitorData.custom_data[field.field_label] || ''}
                onChange={handleInputChange}
                className="visitor-input"
                placeholder={`Digite o ${field.field_label.toLowerCase()}`}
              />
            </div>
          ))}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmittingVisitor}>
              <FontAwesomeIcon icon={isSubmittingVisitor ? faSpinner : faCheckCircle} spin={isSubmittingVisitor} />
              {isSubmittingVisitor ? 'Adicionando...' : 'Adicionar e Fazer Check-in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Componente Checkin para gerenciar o processo de check-in e check-out de pessoas.
 * @param {object} props - Propriedades do componente.
 * @param {function} props.onAddVisitor - Função de callback quando o botão "Adicionar Visitante" é clicado.
 */
function Checkin({ onAddVisitor }) {
  // --- STATE MANAGEMENT ---
  const [allPeople, setAllPeople] = useState([]);
  const [peopleToScan, setPeopleToScan] = useState([]);
  const [checkedInPeople, setCheckedInPeople] = useState([]);
  const [registrationCustomFields, setRegistrationCustomFields] = useState([]); // Renomeado para clareza
  const [visitorCustomFields, setVisitorCustomFields] = useState([]); // Novo estado para campos de visitante
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [userId, setUserId] = useState(null);
  const [showAddVisitorModal, setShowAddVisitorModal] = useState(false); // Estado para controlar o modal

  // --- HELPER FUNCTIONS ---
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // --- DATA FETCHING E REAL-TIME LISTENER ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        showNotification('Você precisa estar logado para acessar o Check-in.', 'error');
        setIsLoading(false);
        return;
      }
      setUserId(user.id);

      // 1. Buscar campos personalizados de cadastro (registration)
      const { data: regFieldsData, error: regError } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'registration');
      
      if (regError) {
        console.error('Erro ao buscar campos de cadastro:', regError);
        showNotification('Falha ao carregar campos de cadastro.', 'error');
      } else {
        setRegistrationCustomFields(regFieldsData || []);
      }

      // 2. Buscar campos personalizados de visitante (visitor)
      const { data: visFieldsData, error: visError } = await supabase
        .from('custom_fields')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'visitor');
      
      if (visError) {
        console.error('Erro ao buscar campos de visitante:', visError);
        showNotification('Falha ao carregar campos de visitante.', 'error');
      } else {
        setVisitorCustomFields(visFieldsData || []);
      }

      // 3. Buscar todos os registros de pessoas
      const { data: peopleData, error: peopleError } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', user.id);

      if (peopleError) {
        console.error('Erro ao buscar pessoas:', peopleError);
        showNotification('Falha ao carregar lista de pessoas.', 'error');
      } else {
        setAllPeople(peopleData || []);
        setPeopleToScan(peopleData.filter(p => !p.checked_in));
        setCheckedInPeople(peopleData.filter(p => p.checked_in));
      }
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    let channel = null;

    const setupRealtimeListener = async () => {
      if (!userId) return;

      channel = supabase.channel(`public:registrations_user_${userId}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'registrations',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('Realtime change received!', payload);
            setAllPeople(prevPeople => {
              let updatedPeople = [...prevPeople];
              const newRecord = payload.new;
              const oldRecord = payload.old;

              if (payload.eventType === 'INSERT') {
                updatedPeople.push(newRecord);
              } else if (payload.eventType === 'UPDATE') {
                updatedPeople = updatedPeople.map(p => 
                  p.id === newRecord.id ? newRecord : p
                );
              } else if (payload.eventType === 'DELETE') {
                updatedPeople = updatedPeople.filter(p => 
                  p.id !== oldRecord.id
                );
              }
              setPeopleToScan(updatedPeople.filter(p => !p.checked_in));
              setCheckedInPeople(updatedPeople.filter(p => p.checked_in));
              return updatedPeople;
            });
          }
        )
        .subscribe();
    };

    setupRealtimeListener();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log('Realtime channel unsubscribed.');
      }
    };
  }, [userId]);

  // --- FILTERING ---
  const filteredPeopleToScan = peopleToScan.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) || // Use optional chaining for safety
    p.telefone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(p.custom_data || {}).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredCheckedInPeople = checkedInPeople.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telefone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(p.custom_data || {}).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // --- EVENT HANDLERS ---
  const updateCheckinStatus = async (personId, status) => {
    setIsUpdatingStatus(true);

    // 1. Atualiza o status na tabela 'registrations' (como já fazia)
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ checked_in: status })
      .eq('id', personId);

    if (updateError) {
      console.error('Erro ao atualizar status:', updateError);
      showNotification(`Erro ao ${status ? 'realizar check-in' : 'realizar check-out'}.`, 'error');
      setIsUpdatingStatus(false);
      return false;
    }

    // 2. (NOVO) Insere o evento na tabela de log
    const { data: { user } } = await supabase.auth.getUser();
    const { error: logError } = await supabase
      .from('checkin_log')
      .insert({
        user_id: user.id,
        registration_id: personId,
        event_type: status ? 'checkin' : 'checkout'
      });
    
    if (logError) {
        // Mesmo que o log falhe, o check-in principal funcionou.
        // Apenas avisamos no console.
        console.error('Erro ao registrar o log do evento:', logError);
    }

    setIsUpdatingStatus(false);
    return true;
  };

  const handleCheckIn = async (person) => {
    const success = await updateCheckinStatus(person.id, true);
    if (success) {
      showNotification(`${person.nome} fez check-in!`, 'success');
    }
  };
  
  const handleCheckOut = async (person) => {
    const success = await updateCheckinStatus(person.id, false);
    if (success) {
      showNotification(`${person.nome} fez check-out.`, 'info');
    }
  };

  // Nova função para adicionar visitante via modal
  const handleAddQuickVisitor = async (visitorData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showNotification('Você precisa estar logado para adicionar visitantes.', 'error');
      return;
    }

    const newVisitor = {
      user_id: user.id,
      nome: visitorData.nome,
      email: null, // Visitantes rápidos não têm email ou telefone padrão
      telefone: null,
      custom_data: visitorData.custom_data,
      checked_in: true, // Já faz check-in ao adicionar
    };

    const { data, error } = await supabase
      .from('registrations')
      .insert(newVisitor)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar visitante rápido:', error);
      showNotification('Erro ao adicionar visitante. Tente novamente.', 'error');
    } else {
      showNotification(`${data.nome} adicionado(a) e fez check-in!`, 'success');
      // O listener de tempo real já cuidará de atualizar as listas
    }
  };

  // --- RENDER ---
  if (isLoading) {
    return (
      <section className="section active" id="checkin-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Carregando pessoas...</p>
      </section>
    );
  }

  return (
    <section className="section active" id="checkin">
      {notification.show && (
          <Notification message={notification.message} type={notification.type} />
      )}

      {/* Modal de Adicionar Visitante */}
      <AddVisitorModal
        isOpen={showAddVisitorModal}
        onClose={() => setShowAddVisitorModal(false)}
        onSubmit={handleAddQuickVisitor}
        visitorCustomFields={visitorCustomFields}
        showNotification={showNotification}
      />

      <h2>Controle de Check-in e Check-out</h2>
      
      <div className="search-and-add">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Pesquisar por nome, email ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-search" aria-label="Pesquisar">
              <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <button className="btn-add-visitor" onClick={() => setShowAddVisitorModal(true)}>
          <FontAwesomeIcon icon={faUserPlus} /> Adicionar Visitante
        </button>
      </div>

      <div className="checkin-area">
        <div className="checkin-list card">
          <h3>Pessoas para Check-in ({filteredPeopleToScan.length})</h3>
          <div className="people-list-container">
            {filteredPeopleToScan.length > 0 ? (
                <div className="people-list">
                    {filteredPeopleToScan.map(person => (
                    <div key={person.id} className="person-item">
                        <div className="person-info">
                            <div className="person-name">{person.nome}</div>
                            <div className="person-email">{person.email}</div>
                            {person.telefone && <div className="person-phone">Tel: {person.telefone}</div>}
                            {/* Exibe campos personalizados de cadastro (registration) */}
                            {registrationCustomFields.map(field => 
                                person.custom_data && person.custom_data[field.field_label] && (
                                    <div key={field.id} className="person-custom-field">
                                        <strong>{field.field_label}:</strong> {person.custom_data[field.field_label]}
                                    </div>
                                )
                            )}
                        </div>
                        <button 
                            className="btn-action checkin" 
                            onClick={() => handleCheckIn(person)} 
                            disabled={isUpdatingStatus}
                            aria-label={`Realizar check-in de ${person.nome}`}
                        >
                            <FontAwesomeIcon icon={faCheckCircle} /> Check-in
                        </button>
                    </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">Nenhuma pessoa para check-in encontrada.</div>
            )}
          </div>
        </div>

        <div className="checked-in-list card">
          <h3>Pessoas em Check-in ({filteredCheckedInPeople.length})</h3>
          <div className="people-list-container">
            {filteredCheckedInPeople.length > 0 ? (
                <div className="people-list">
                    {filteredCheckedInPeople.map(person => (
                    <div key={person.id} className="person-item checked-in">
                        <div className="person-info">
                            <div className="person-name">{person.nome}</div>
                            <div className="person-email">{person.email}</div>
                            {person.telefone && <div className="person-phone">Tel: {person.telefone}</div>}
                            {/* Exibe campos personalizados de cadastro (registration) */}
                            {registrationCustomFields.map(field => 
                                person.custom_data && person.custom_data[field.field_label] && (
                                    <div key={field.id} className="person-custom-field">
                                        <strong>{field.field_label}:</strong> {person.custom_data[field.field_label]}
                                    </div>
                                )
                            )}
                        </div>
                        <button 
                            className="btn-action checkout" 
                            onClick={() => handleCheckOut(person)}
                            disabled={isUpdatingStatus}
                            aria-label={`Realizar check-out de ${person.nome}`}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} /> Check-out
                        </button>
                    </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">Nenhuma pessoa em check-in.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkin;
