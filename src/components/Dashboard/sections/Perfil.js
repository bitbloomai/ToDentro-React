import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

// Dados de exemplo do perfil do usuário
const mockProfileData = {
  profileName: 'Usuário ToDentro',
  profileEmail: 'usuario@todentro.com.br',
  profilePhone: '(32) 9 9952-6526',
};

function Perfil() {
  const [formData, setFormData] = useState({
    profileName: '',
    profileEmail: '',
    profilePhone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // useEffect para carregar os dados do perfil quando o componente montar
  useEffect(() => {
    // Simula uma chamada de API para buscar os dados do usuário
    setTimeout(() => {
      setFormData(mockProfileData);
      setIsLoading(false);
    }, 1000); // Atraso de 1 segundo para simular o carregamento
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Salvando alterações do perfil:', formData);
    // Aqui você enviaria os dados para o Supabase para atualizar o perfil
    setNotification('Perfil salvo com sucesso!');
    // Esconde a notificação após alguns segundos
    setTimeout(() => setNotification(''), 3000);
  };
  
  if (isLoading) {
    return <div className="empty-state">Carregando perfil...</div>;
  }

  return (
    <section className="section active" id="perfil">
      <h2>Perfil</h2>

      {/* Notificação de sucesso */}
      {notification && <div className="notification success show">{notification}</div>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="profileName">Nome</label>
          <input 
            type="text" 
            id="profileName"
            value={formData.profileName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profileEmail">Email</label>
          <input 
            type="email" 
            id="profileEmail"
            value={formData.profileEmail}
            onChange={handleInputChange}
            disabled // Geralmente o e-mail não é editável
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePhone">Telefone</label>
          <input 
            type="tel" 
            id="profilePhone"
            value={formData.profilePhone}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn-submit">
          <FontAwesomeIcon icon={faSave} /> Salvar Alterações
        </button>
      </form>
    </section>
  );
}

export default Perfil;