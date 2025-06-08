import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Verifique se o caminho para seu cliente supabase está correto

// Importando os estilos
import './ForgotPassword.css'; 
// Importe o CSS global se você moveu a classe .background para lá
// import '../../App.css'; 

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // ATENÇÃO: Atualize esta URL para a URL do seu site em produção
      redirectTo: 'https://to-dentro-react.vercel.app/reset-password', 
    });

    if (error) {
      setError('Erro ao enviar o e-mail. Verifique o endereço e tente novamente.');
      console.error('Error:', error.message);
    } else {
      setMessage('E-mail de recuperação enviado! Por favor, verifique sua caixa de entrada e a pasta de spam.');
    }
    setLoading(false);
  };

  return (
    <div className="background"> {/* Classe para o plano de fundo de tela cheia */}
      <div className="forgot-password-container"> {/* Container branco central */}
        
        <h2>Recuperar Senha</h2>
        <p>Não se preocupe! Digite seu e-mail e enviaremos um link para você criar uma nova senha.</p>
        
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            placeholder="Seu e-mail cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email para recuperação de senha"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        {/* Exibe mensagens de sucesso ou erro */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="back-to-login">
          <Link to="/login">Lembrou a senha? Voltar para o Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;