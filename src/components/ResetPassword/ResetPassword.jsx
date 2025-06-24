import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

import './ResetPassword.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Novo estado para controlar o status da sessão
  const [sessionStatus, setSessionStatus] = useState('checking'); // 'checking', 'ready', 'error'

  // O useEffect agora tem a lógica manual para criar a sessão
  useEffect(() => {
    // 1. Pega os parâmetros da URL depois do '#'
    // O .substring(1) remove o '#' do início
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    // 2. Verifica se os tokens necessários existem na URL
    if (accessToken && refreshToken) {
      console.log('Tokens encontrados na URL. Tentando definir a sessão manualmente.');
      
      // 3. Força a criação da sessão no Supabase com os tokens encontrados
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          console.error('Erro ao definir sessão manualmente:', error);
          setError('O link de redefinição é inválido ou corrompido.');
          setSessionStatus('error');
        } else {
          console.log('Sessão definida manualmente com sucesso!');
          setSessionStatus('ready'); // A sessão está pronta!
        }
      });
    } else {
      console.error('Tokens de acesso não encontrados na URL. O link pode estar quebrado.');
      setError('Link inválido. Por favor, solicite um novo link de recuperação.');
      setSessionStatus('error');
    }
  }, []); // Roda apenas uma vez quando o componente monta

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError('Não foi possível redefinir a senha. Sua sessão pode ter expirado.');
      console.error('Erro detalhado do Supabase:', error);
    } else {
      setMessage('Senha redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
    setLoading(false);
  };

  // Renderização condicional para o formulário
  const renderForm = () => {
    if (sessionStatus === 'checking') {
      return <p>Validando seu link...</p>;
    }

    if (sessionStatus === 'error') {
      // A mensagem de erro já será exibida pelo estado 'error'
      return null; 
    }

    // Se a sessão estiver 'ready', mostra o formulário
    return (
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Digite a nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirme a nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Nova Senha'}
        </button>
      </form>
    );
  }

  return (
    <div className="background">
      <div className="reset-password-container">
        <h2>Crie sua Nova Senha</h2>
        {renderForm()}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;