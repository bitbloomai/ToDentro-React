import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; // Ajuste o caminho se necessário

// 1. Cria o Contexto
const ProfileContext = createContext();

// 2. Cria o Provedor do Contexto
export function ProfileProvider({ children }) {
  const [companyName, setCompanyName] = useState('Nome do Evento'); // Valor padrão
  const [colors, setColors] = useState({
    primary: '#7FA869',
    secondary: '#0F5DA4',
  });
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do perfil no Supabase
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('company_name, primary_color, secondary_color')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setCompanyName(profileData.company_name || 'Nome do Evento');
        setColors({
          primary: profileData.primary_color || '#7FA869',
          secondary: profileData.secondary_color || '#0F5DA4',
        });
      }
    }
    setLoading(false);
  }, []);

  // Busca o perfil quando o componente é montado
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  // Aplica as cores na interface sempre que elas mudarem
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
  }, [colors]);

  // Valor que será compartilhado com os componentes filhos
  const value = {
    companyName,
    setCompanyName,
    colors,
    setColors,
    loading,
    refreshProfile: fetchProfile // Função para recarregar os dados após salvar
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// 3. Cria um Hook customizado para facilitar o uso do contexto
export function useProfile() {
  return useContext(ProfileContext);
}
