import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabaseClient';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faCheckCircle, faExclamationTriangle, faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './Scanner.css';

// Componente de Notificação
const Notification = ({ message, type, show }) => {
    if (!show) return null;
    return <div className={`notification notification-scanner ${type} ${show ? 'show' : ''}`}>{message}</div>;
};

function Scanner() {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const scannerRef = useRef(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3500);
    };

    useEffect(() => {
        if (!isScanning) {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Falha ao limpar o scanner.", err));
                scannerRef.current = null;
            }
            return;
        }

        if (scannerRef.current) {
            return;
        }

        const qrScanner = new Html5QrcodeScanner(
            'qr-reader', 
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        const onScanSuccess = async (decodedText) => {
            setIsScanning(false);
            setIsLoading(true);
            
            const registrationId = decodedText;
            
            // 1. Busca o cadastro no Supabase
            const { data: person, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('id', registrationId)
                .single();

            if (error || !person) {
                setScanResult({ status: 'error', message: 'QR Code inválido ou não encontrado.' });
                showNotification('Ingresso não reconhecido!', 'error');
                setIsLoading(false);
                return;
            }

            // 2. Verifica se a pessoa já fez check-in
            if (person.checked_in) {
                setScanResult({ status: 'already_checked_in', person });
                showNotification(`${person.nome} já realizou o check-in.`, 'info');
                setIsLoading(false);
                return;
            }

            // 3. Se não fez, atualiza o status para fazer o check-in
            const { data: updatedPerson, error: updateError } = await supabase
                .from('registrations')
                .update({ checked_in: true })
                .eq('id', person.id)
                .select()
                .single();
            
            if (updateError) {
                setScanResult({ status: 'error', message: 'Ocorreu um erro ao tentar realizar o check-in.' });
                showNotification(`Erro ao fazer check-in de ${person.nome}.`, 'error');
                setIsLoading(false);
                return;
            }

            // 4. Sucesso! Exibe a confirmação.
            setScanResult({ status: 'success', person: updatedPerson });
            showNotification(`Check-in de ${updatedPerson.nome} realizado com sucesso!`, 'success');
            setIsLoading(false);
        };

        qrScanner.render(onScanSuccess, () => {});
        scannerRef.current = qrScanner;

    }, [isScanning]);

    const handleResetScanner = () => {
        setScanResult(null);
        setIsLoading(false);
        setIsScanning(true);
    };

    // Função para renderizar o resultado do escaneamento
    const renderScanResult = () => {
        if (!scanResult) return null;

        switch (scanResult.status) {
            case 'success':
                return (
                    <div className="scan-result valid">
                        <h4><FontAwesomeIcon icon={faCheckCircle} /> Check-in Confirmado!</h4>
                        <div className="result-details">
                            <p><strong>Nome:</strong> {scanResult.person.nome}</p>
                            <p><strong>Email:</strong> {scanResult.person.email || 'Não informado'}</p>
                        </div>
                    </div>
                );
            case 'already_checked_in':
                return (
                    <div className="scan-result info">
                        <h4><FontAwesomeIcon icon={faInfoCircle} /> Check-in já realizado</h4>
                        <div className="result-details">
                            <p><strong>Nome:</strong> {scanResult.person.nome}</p>
                            <p><strong>Email:</strong> {scanResult.person.email || 'Não informado'}</p>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className="scan-result invalid">
                        <h4><FontAwesomeIcon icon={faExclamationTriangle} /> Ingresso Inválido</h4>
                        <p>{scanResult.message}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section className="section active" id="scanner">
            <Notification {...notification} />
            <h2><FontAwesomeIcon icon={faQrcode} /> Leitor de QR Code</h2>
            <p className="scanner-instruction">Aponte a câmera para o QR Code do ingresso para validar o check-in.</p>
            
            <div className="scanner-container card">
                {isScanning && <div id="qr-reader"></div>}
                {isLoading && (
                    <div className="scanner-feedback loading">
                        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                        <p>Validando ingresso...</p>
                    </div>
                )}

                {scanResult && (
                    <>
                        {renderScanResult()}
                        <button className="btn-rescan" onClick={handleResetScanner}>
                            Escanear Novamente
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}

export default Scanner;
