import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate para redirecionar após o login
import './Login.css'; // Importar o CSS

// Importação do Logo
import logo from '../../assets/images/logo-cabeçalho.png';
// Importe seu cliente Supabase aqui (se configurado em um arquivo separado)
// import { supabase } from '../../supabaseClient'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook para redirecionamento

  const handleLogin = async (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    setIsLoading(true);
    setError('');

    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (email === "teste@email.com" && password === "123456") {
        console.log("Login simulado com sucesso!");
        navigate('/dashboard'); // Redireciona para a página principal após o login
      } else {
        throw new Error("E-mail ou senha inválidos.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="background" id="login-background">
      <div className="frame-login">
        <img src={logo} alt="Logo ToDentro" className="logo-login" />
        <hr className="linha-login" />

        {/* Exibe a mensagem de erro, se houver */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="formulario-login">
          <label htmlFor="email">Seu E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="exemplo@email.com"
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Sua Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            className="input-senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`botao-login ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="button-text">Login</span>
          </button>
        </form>

        <div className="links-extras">
          <Link to="/forgot-password" className="esqueceu-senha">
            Esqueceu sua senha?
          </Link>
          <p>
            Não tem uma conta?{' '}
            <Link to="/signup" className="link-cadastro">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;