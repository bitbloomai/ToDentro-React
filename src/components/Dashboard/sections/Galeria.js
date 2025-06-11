import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabaseClient'; // Verifique o caminho
import './Galeria.css'; // Adicione a importação do CSS

// Componente do Modal de Confirmação (reutilizável)
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

function Galeria() {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [modal, setModal] = useState({ isOpen: false, message: '', onConfirm: null });
  const fileInputRef = useRef(null);

  // Função para exibir notificações
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Efeito para buscar as imagens do Supabase Storage ao carregar
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Lista todos os arquivos na pasta do usuário dentro do bucket 'gallery'
        const { data: fileList, error } = await supabase.storage
          .from('gallery') // Nome do seu bucket
          .list(user.id, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
          });

        if (error) {
          console.error('Erro ao listar imagens:', error);
          showNotification('Falha ao carregar a galeria.', 'error');
        } else {
          // Para cada arquivo, obtemos a URL pública para exibição
          const imageUrls = fileList.map(file => {
            const { data } = supabase.storage
              .from('gallery')
              .getPublicUrl(`${user.id}/${file.name}`);
            return {
              id: file.id,
              name: file.name, // Guardamos o nome do arquivo para a exclusão
              src: data.publicUrl
            };
          });
          setImages(imageUrls);
        }
      }
      setIsLoading(false);
    };

    fetchImages();
  }, []);

  // Aciona o input de arquivo escondido
  const handleUploadClick = () => {
    if (isUploading) return;
    fileInputRef.current.click();
  };

  // Lida com o upload de novos arquivos
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showNotification('Você precisa estar logado para fazer upload.', 'error');
      setIsUploading(false);
      return;
    }

    // Faz o upload de cada arquivo em paralelo
    const uploadPromises = files.map(file => {
      const fileName = `${Date.now()}-${file.name}`;
      return supabase.storage
        .from('gallery')
        .upload(`${user.id}/${fileName}`, file);
    });

    const results = await Promise.all(uploadPromises);
    
    // Processa os resultados
    const newImageObjects = [];
    results.forEach(({ data, error }) => {
      if (error) {
        console.error('Erro no upload:', error);
        showNotification(`Falha ao enviar uma ou mais imagens.`, 'error');
      } else {
        // Se o upload foi bem-sucedido, obtemos a URL pública
        const { data: publicUrlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(data.path);
        
        newImageObjects.push({
            // O Supabase não retorna um ID de arquivo no upload, então usamos o path
            id: data.path,
            name: data.path.split('/').pop(),
            src: publicUrlData.publicUrl
        });
      }
    });

    setImages(prevImages => [...newImageObjects, ...prevImages]);
    if(newImageObjects.length > 0) showNotification(`${newImageObjects.length} imagem(ns) adicionada(s)!`);
    setIsUploading(false);
    event.target.value = ''; // Limpa o input para permitir o mesmo arquivo novamente
  };
  
  // Alterna a seleção de uma imagem
  const toggleImageSelection = (imageId) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  // Abre o modal de confirmação para remover imagens
  const openRemoveModal = () => {
    if (selectedImages.size === 0) return;
    setModal({
        isOpen: true,
        message: `Tem certeza que deseja remover ${selectedImages.size} imagem(ns)?`,
        onConfirm: handleRemoveSelected
    });
  };

  // Remove as imagens selecionadas do Supabase Storage
  const handleRemoveSelected = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const filesToRemove = images
      .filter(img => selectedImages.has(img.id))
      .map(img => `${user.id}/${img.name}`);

    const { error } = await supabase.storage
      .from('gallery')
      .remove(filesToRemove);

    if (error) {
        console.error('Erro ao remover imagens:', error);
        showNotification('Erro ao remover as imagens.', 'error');
    } else {
        setImages(images.filter(img => !selectedImages.has(img.id)));
        setSelectedImages(new Set()); // Limpa a seleção
        showNotification('Imagens removidas com sucesso.');
    }
    setModal({ isOpen: false }); // Fecha o modal
  };

  return (
    <section className="section active" id="galeria">
      {notification.show && (
        <div className={`notification ${notification.type} show`}>{notification.message}</div>
      )}
      {modal.isOpen && (
        <ConfirmationModal 
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal({ isOpen: false })}
        />
      )}

      <h2>Galeria</h2>
      
      <div className="gallery-controls">
        <button className="btn-upload" onClick={handleUploadClick} disabled={isUploading}>
          <FontAwesomeIcon icon={isUploading ? faSpinner : faCloudUploadAlt} spin={isUploading} /> 
          {isUploading ? 'Enviando...' : 'Adicionar Imagem'}
        </button>
        <button 
          className="btn-remove" 
          onClick={openRemoveModal}
          disabled={selectedImages.size === 0}
        >
          <FontAwesomeIcon icon={faTrash} /> Remover Selecionadas
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <p>Carregando galeria...</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.length > 0 ? (
            images.map(image => (
              <div 
                key={image.id} 
                className={`gallery-item ${selectedImages.has(image.id) ? 'selected' : ''}`}
                onClick={() => toggleImageSelection(image.id)}
              >
                <img src={image.src} alt={`Galeria item`} loading="lazy" />
                <div className="selection-overlay"></div>
                <div className="checkmark">✔</div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <h3>Nenhuma imagem na galeria.</h3>
              <p>Adicione a primeira clicando no botão acima!</p>
            </div>
          )}
        </div>
      )}
      
      <input 
        type="file" 
        id="imageInput" 
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/gif" 
        multiple 
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </section>
  );
}

export default Galeria;
