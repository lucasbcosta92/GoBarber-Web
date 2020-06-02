import React, { createContext, useContext, useCallback, useState } from 'react';
import api from '../services/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

// const AuthContext = createContext<AuthContextData>({} as AuthContextData); // inicializando como vazio
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // VERIFICANDO SE O USUÁRIO JÁ EFETUOU O LOGIN
  const [data, setData] = useState<AuthState>(() => {
    // buscando os dados do usuário e o token de auth no localstorage
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      // definindo o cabeçalho com o token na chamada da api.
      // Isso tira a necessidade de sempre termos de passar o token em uma chamada a api
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  // login
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    // salvando os dados do usuário e o token de auth no localstorage
    const { token, user } = response.data;
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // definindo o cabeçalho com o token na chamada da api.
    // Isso tira a necessidade de sempre termos de passar o token em uma chamada a api
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  // logout
  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  // atualização de usuário (dados cadastrais e avatar)
  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
