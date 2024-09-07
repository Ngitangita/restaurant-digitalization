import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; 
import './index.css';
import { ProfileProvider } from './components/profileMenu/ProfileContext';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </StrictMode>
);
