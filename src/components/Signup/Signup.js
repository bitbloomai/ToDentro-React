import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

// Importação do Logo
import logo from '../../assets/images/logo-cabeçalho.png';
// Importe seu cliente Supabase aqui
// import { supabase } from '../../supabaseClient';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Campo adicional
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    // 1. Validação do lado do cliente
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    /*
    // --- LÓGICA REAL COM SUPABASE (EXEMPLO) ---
    // Substitua o bloco 'try/catch' abaixo por este para integrar com o Supabase
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      setSuccessMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      setError(error.message || 'Ocorreu um erro ao criar a conta.');
    } finally {
      setIsLoading(false);
    }
    */

    // --- LÓGICA DE SIMULAÇÃO (PODE REMOVER DEPOIS) ---
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Cadastro simulado com sucesso para:", email);
      setSuccessMessage('Cadastro realizado com sucesso! Você já pode fazer o login.');
      // Limpa os campos do formulário
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError("Não foi possível realizar o cadastro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background" id="signup-background">
      <div className="frame-signup">
        <img src={logo} alt="Logo ToDentro" className="logo-signup" />
        <hr className="linha-signup" />

        {/* Exibe a mensagem de erro ou sucesso */}
        {error && <div className="message error-message">{error}</div>}
        {successMessage && <div className="message success-message">{successMessage}</div>}

        <form onSubmit={handleSignUp} className="formulario-signup">
          <label htmlFor="email">Seu E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="exemplo@email.com"
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Crie uma Senha</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="input-senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="confirmPassword">Confirme sua Senha</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            className="input-senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`botao-signup ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="button-text">Cadastrar</span>
          </button>
        </form>

        <div className="links-extras">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="link-login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;