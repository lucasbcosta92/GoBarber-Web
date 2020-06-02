import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// estilo
import GlobalStyle from './styles/global';
// /rotas
import Routes from './routes';
// context/hooks
import AppProvider from './hooks';

const App: React.FC = () => (
  <Router>
    {/* TODOS OS COMPONENTES DENTRO DESSA TAG TERÁ ACESSO A INFORMAÇÃO DE AUTENTICAÇÃO/Toast */}
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </Router>
);

export default App;
