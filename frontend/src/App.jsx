import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import { AppRouter } from './router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
