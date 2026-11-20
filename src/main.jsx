import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/vazirmatn';
import '@fontsource/markazi-text/arabic-500.css';
import '@fontsource/markazi-text/arabic-700.css';
import '@fontsource/markazi-text/latin-500.css';
import '@fontsource/markazi-text/latin-700.css';
import './styles.css';
import { LangProvider } from './i18n';
import { MenuProvider } from './MenuContext';
import { LiveMenuProvider } from './live/LiveMenu';
import App from './App';

// The cafe's price panel lives at #/admin and is loaded only when opened.
const Admin = lazy(() => import('./admin/Admin'));
const isAdmin = () => window.location.hash.startsWith('#/admin');

function Root() {
  const [admin, setAdmin] = useState(isAdmin);
  useEffect(() => {
    const onHash = () => setAdmin(isAdmin());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (admin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }
  return (
    <LangProvider>
      <LiveMenuProvider>
        <MenuProvider>
          <App />
        </MenuProvider>
      </LiveMenuProvider>
    </LangProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
