import React, { useState, useEffect, useRef } from 'react';
// Verifique se este caminho para o supabaseClient está correto para sua estrutura.
// Ele sobe três níveis (sections -> Dashboard -> components) para chegar em 'src'.
import { supabase } from '../../../supabaseClient'; 
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faCheckCircle, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Scanner.css';
import '../Dashboard.css';

// Componente de Notificação
const Notification = ({ message, type, show }) => {
    if (!show) return null;
    // Adicionei a classe 'notification-scanner' para evitar conflitos de estilo
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
            // Se o scanner foi parado, tenta limpar a instância anterior
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Falha ao limpar o scanner.", err));
                scannerRef.current = null;
            }
            return;
        }

        // Garante que o scanner seja inicializado apenas uma vez
        if (scannerRef.current) {
            return;
        }

        const qrScanner = new Html5QrcodeScanner(
            'qr-reader', 
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false // verbose
        );

        const onScanSuccess = async (decodedText) => {
            setIsScanning(false);
            setIsLoading(true);
            
            const registrationId = decodedText;
            
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('id', registrationId)
                .single();

            if (error || !data) {
                setScanResult({ valid: false, message: 'QR Code inválido ou não encontrado na base de dados.' });
                showNotification('Ingresso não reconhecido!', 'error');
            } else {
                setScanResult({ valid: true, person: data });
                showNotification('Ingresso válido encontrado!', 'success');
            }
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
                    <div className={`scan-result ${scanResult.valid ? 'valid' : 'invalid'}`}>
                        {scanResult.valid ? (
                            <>
                                <h4><FontAwesomeIcon icon={faCheckCircle} /> Ingresso Válido</h4>
                                <div className="result-details">
                                    <p><strong>Nome:</strong> {scanResult.person.nome}</p>
                                    <p><strong>Email:</strong> {scanResult.person.email || 'Não informado'}</p>
                                    <p><strong>Status:</strong> {scanResult.person.checked_in ? 'Check-in já realizado' : 'Pronto para check-in'}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h4><FontAwesomeIcon icon={faExclamationTriangle} /> Ingresso Inválido</h4>
                                <p>{scanResult.message}</p>
                            </>
                        )}
                        <button className="btn-rescan" onClick={handleResetScanner}>
                            Escanear Novamente
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Scanner;
