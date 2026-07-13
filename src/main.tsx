import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PwaProvider } from '@/context/PwaContext';
import { AppRoutes } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <PwaProvider>
        <AppRoutes />
      </PwaProvider>
    </BrowserRouter>
  </StrictMode>,
);
