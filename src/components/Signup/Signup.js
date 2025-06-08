// src/Signup/Signup.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Signup.css';

// Importação do Logo
import logo from '../../assets/images/logo-cabeçalho.png';

function Signup() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // 1. ADIÇÃO: Estado para o campo 'Confirmar Senha' que estava faltando.
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSignUp = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            setLoading(false); // Para o processo de loading
            return; // Interrompe a função para não continuar com o cadastro
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            setSuccessMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
        }
        setLoading(false);
    };

    return (
        <div className="background" id="signup-background">
            <div className="frame-signup">
                <img src={logo} alt="Logo ToDentro" className="logo-signup" />
                <hr className="linha-signup" />

                {/* Mensagens de erro e sucesso */}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <form onSubmit={handleSignUp} className="formulario-signup">
                    <label htmlFor="email">Seu E-mail</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="exemplo@email.com"
                        className="input-email" // Mantive sua classe
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <label htmlFor="password">Crie uma Senha</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        className="input-senha" // Mantive sua classe
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <label htmlFor="confirmPassword">Confirme sua Senha</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="••••••••"
                        className="input-senha" // Mantive sua classe
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        className={`botao-signup ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {/* Usei o seu texto, mas a lógica de loading continua a mesma */}
                        <span className="button-text">{loading ? 'Cadastrando...' : 'Cadastrar'}</span>
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

export default Signup;