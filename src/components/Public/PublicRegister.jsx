import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './PublicRegister.css';

// Componente de notificação para esta página
const Notification = ({ message, type, show }) => {
    if (!show) return null;
    return <div className={`notification ${type} show`}>{message}</div>;
};

const LoadingSpinner = ({ text }) => (
    <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>{text}</p>
    </div>
);

function PublicRegister() {
    const { ownerId } = useParams(); // Pega o ID do organizador da URL
    const [customFields, setCustomFields] = useState([]);
    const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedRegistration, setCompletedRegistration] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [eventName, setEventName] = useState('Evento'); // Opcional: Nome do evento

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    useEffect(() => {
        if (!ownerId) {
            showNotification('Link de evento inválido.', 'error');
            setIsLoading(false);
            return;
        }

        const fetchEventData = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('custom_fields')
                .select('*')
                .eq('user_id', ownerId);

            if (error || !data) {
                showNotification('Não foi possível carregar os detalhes do evento.', 'error');
            } else {
                setCustomFields(data);
            }
            setIsLoading(false);
        };

        fetchEventData();
    }, [ownerId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

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
            user_id: ownerId,
            ...standardData, 
            custom_data: customData 
        };

        const { data, error } = await supabase.from('registrations').insert(newRegistration).select().single();

        if (error) {
            showNotification('Erro ao realizar o cadastro. Verifique os dados e tente novamente.', 'error');
            setIsSubmitting(false);
        } else {
            showNotification('Cadastro realizado com sucesso!');
            setCompletedRegistration(data);
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Carregando formulário do evento..." />;
    }

    if (completedRegistration) {
        return (
            <div className="public-container">
                <div className="qr-success-card">
                    <h2><FontAwesomeIcon icon={faCheckCircle} /> Cadastro Confirmado!</h2>
                    <p>Olá, <strong>{completedRegistration.nome}</strong>! Seu ingresso foi gerado com sucesso.</p>
                    <p className="instruction">Apresente este QR Code na entrada do evento. Recomendamos que você tire um print da tela.</p>
                    <div className="qr-code-wrapper">
                        <QRCodeSVG
                            id="qr-code-canvas"
                            value={completedRegistration.id.toString()}
                            size={256}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="public-container">
            <Notification {...notification} />
            <div className="public-card">
                <h2>Cadastro para {eventName}</h2>
                <p>Preencha seus dados abaixo para confirmar sua presença.</p>
                <form className="public-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome Completo</label>
                        <input type="text" id="nome" name="nome" value={formData.nome || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefone">Telefone (Opcional)</label>
                        <input type="tel" id="telefone" name="telefone" value={formData.telefone || ''} onChange={handleInputChange} />
                    </div>

                    {customFields.map((field) => (
                        <div className="form-group" key={field.id}>
                            <label htmlFor={field.field_label}>{field.field_label}</label>
                            <input 
                                type="text" 
                                id={field.field_label}
                                name={field.field_label} 
                                value={formData[field.field_label] || ''} 
                                onChange={handleInputChange} 
                            />
                        </div>
                    ))}
                    
                    <button type="submit" className="btn-submit-public" disabled={isSubmitting}>
                        <FontAwesomeIcon icon={isSubmitting ? faSpinner : faSave} spin={isSubmitting} /> 
                        {/* --- CORREÇÃO AQUI --- */}
                        {isSubmitting ? 'Finalizando...' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PublicRegister;
