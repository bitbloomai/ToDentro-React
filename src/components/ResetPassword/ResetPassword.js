import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Verifique o caminho

// Importando os estilos
import './ResetPassword.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // quando esta página é carregada a partir do link de e-mail.

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

    // A função updateUser, quando chamada após o usuário chegar pelo link de redefinição,
    // irá atualizar a senha do usuário autenticado pela sessão do token.
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError('Não foi possível redefinir a senha. O link pode ter expirado ou ser inválido.');
      console.error('Error:', error.message);
    } else {
      setMessage('Senha redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        navigate('/login'); // Redireciona para o login após 3 segundos
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <div className="background"> {/* Classe para o plano de fundo */}
      <div className="reset-password-container"> {/* Container branco central */}
        
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

        {/* Exibe mensagens de sucesso ou erro */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

      </div>
    </div>
  );
}

export default ResetPassword;