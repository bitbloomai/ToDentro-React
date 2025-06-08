import React, { useState, useEffect } from 'react'; // 1. Adicionado o useEffect aqui
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

  // 2. ESTE É O BLOCO DE CÓDIGO ADICIONADO PARA CORRIGIR O ERRO
  // Ele "escuta" as mudanças de estado de autenticação do Supabase.
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      // O evento 'PASSWORD_RECOVERY' é disparado quando o usuário chega
      // na página através de um link de recuperação de senha.
      // Neste ponto, a sessão segura e temporária já foi estabelecida.
      if (event === "PASSWORD_RECOVERY") {
        console.log("Sessão de recuperação de senha estabelecida. Pronto para atualizar.");
      }
    });

    // Função de limpeza para remover o "ouvinte" quando o componente é desmontado.
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez.

  
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
      setError('Não foi possível redefinir a senha. A sessão pode ter expirado.');
      console.error('Erro detalhado do Supabase:', error);
    } else {
      setMessage('Senha redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="background">
      <div className="reset-password-container">
        <h2>Crie sua Nova Senha</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Digite a nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Nova senha"
          />
          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-label="Confirmação da nova senha"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;