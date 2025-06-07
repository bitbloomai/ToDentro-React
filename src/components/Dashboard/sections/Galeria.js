import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

// Dados de exemplo - no app real, viriam do Supabase Storage
const initialImages = [
  { id: 1, src: 'https://via.placeholder.com/200x200.png?text=Evento+1' },
  { id: 2, src: 'https://via.placeholder.com/200x200.png?text=Evento+2' },
  { id: 3, src: 'https://via.placeholder.com/200x200.png?text=Evento+3' },
];

function Galeria() {
  const [images, setImages] = useState(initialImages);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const fileInputRef = useRef(null);

  // Aciona o input de arquivo escondido
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Lida com a seleção de novos arquivos
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImageObjects = files.map(file => ({
      id: Date.now() + Math.random(), // ID único
      // URL.createObjectURL cria uma URL temporária para preview no navegador
      // No app real, você faria o upload para o servidor e usaria a URL retornada
      src: URL.createObjectURL(file), 
    }));
    setImages([...images, ...newImageObjects]);
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

  // Remove as imagens selecionadas
  const handleRemoveSelected = () => {
    if (window.confirm(`Tem certeza que deseja remover ${selectedImages.size} imagem(ns)?`)) {
        setImages(images.filter(img => !selectedImages.has(img.id)));
        setSelectedImages(new Set()); // Limpa a seleção
    }
  };

  return (
    <section className="section active" id="galeria">
      <h2>Galeria</h2>
      
      <div className="gallery-controls">
        <button className="btn-upload" onClick={handleUploadClick}>
          <FontAwesomeIcon icon={faCloudUploadAlt} /> Adicionar Imagem
        </button>
        <button 
          className="btn-remove" 
          onClick={handleRemoveSelected}
          disabled={selectedImages.size === 0}
        >
          <FontAwesomeIcon icon={faTrash} /> Remover Selecionadas
        </button>
      </div>

      <div className="gallery-grid">
        {images.length > 0 ? (
          images.map(image => (
            <div 
              key={image.id} 
              className={`gallery-item ${selectedImages.has(image.id) ? 'selected' : ''}`}
              onClick={() => toggleImageSelection(image.id)}
            >
              <img src={image.src} alt={`Galeria item ${image.id}`} />
            </div>
          ))
        ) : (
          <div className="empty-state">Nenhuma imagem na galeria. Adicione a primeira!</div>
        )}
      </div>
      
      {/* Input de arquivo escondido */}
      <input 
        type="file" 
        id="imageInput" 
        ref={fileInputRef}
        accept="image/*" 
        multiple 
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </section>
  );
}

export default Galeria;