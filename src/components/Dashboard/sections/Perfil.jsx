import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCamera } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabaseClient';

// Importando o CSS do perfil
import './Perfil.css';

function Perfil() {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone: '',
    email: '',
    avatar_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function getProfile() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não encontrado.");

        const { data, error, status } = await supabase
          .from('profiles')
          .select(`full_name, username, phone, avatar_url`)
          .eq('id', user.id)
          .single();

        if (error && status !== 406) throw error;
        
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            username: data.username || '',
            phone: data.phone || '',
            avatar_url: data.avatar_url || '',
            email: user.email,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error.message);
      } finally {
        setIsLoading(false);
      }
    }
    getProfile();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarUpload = async (event) => {
    try {
      setIsUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload.');
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const newAvatarUrl = `${urlData.publicUrl}?t=${new Date().getTime()}`; // Adiciona timestamp para evitar cache

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl, updated_at: new Date() })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setFormData(prev => ({ ...prev, avatar_url: newAvatarUrl }));
      setNotification('Avatar atualizado com sucesso!');
    } catch (error) {
      console.error('Erro no upload do avatar:', error.message);
      setNotification('Erro ao atualizar o avatar.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    try {
      setNotification('Salvando...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado para atualização.");

      // Objeto com os dados a serem atualizados
      const updates = {
        id: user.id, // A chave primária para saber qual linha atualizar
        full_name: formData.full_name,
        phone: formData.phone,
        updated_at: new Date(), // Atualiza a data da última modificação
      };

      // A chamada para o Supabase usando 'upsert'
      // Upsert: atualiza a linha se ela existir, ou cria se não existir.
      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error; // Joga o erro para o bloco catch
      }

      setNotification('Perfil salvo com sucesso!');

    } catch (error) {
      setNotification('Erro ao salvar o perfil. Tente novamente.');
      console.error('Erro ao salvar perfil:', error.message);
    } finally {
      // Esconde a notificação após 3 segundos
      setTimeout(() => setNotification(''), 3000);
    }
  };
  
  if (isLoading) {
    return <div className="empty-state">Carregando perfil...</div>;
  }

  return (
    <section className="section active" id="perfil">
      <div className="perfil-container">

        <div className="avatar-uploader" onClick={handleAvatarClick}>
          <img
            src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.full_name || formData.email}&background=7FA869&color=fff&size=120`}
            alt="Avatar"
            className="avatar-image"
          />
          <div className="edit-avatar-overlay">
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarUpload}
          style={{ display: 'none' }}
          accept="image/png, image/jpeg"
          disabled={isUploading}
        />

        <form className="perfil-form" onSubmit={handleSubmit}>
          {notification && <div className={`notification success show`}>{notification}</div>}

          <div className="form-group">
            <label htmlFor="full_name">Nome Completo</label>
            <input type="text" id="full_name" value={formData.full_name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={formData.email} disabled />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} />
          </div>
          <button type="submit" className="btn-submit">
            <FontAwesomeIcon icon={faSave} /> Salvar Alterações
          </button>
        </form>
      </div>
    </section>
  );
}

export default Perfil;