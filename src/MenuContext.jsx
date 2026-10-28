import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const MenuContext = createContext(null);

// Holds the product shown in the detail sheet. Opening pushes a history entry
// so the phone's back button closes the sheet instead of leaving the menu.
export function MenuProvider({ children }) {
  const [product, setProduct] = useState(null);

  const openProduct = useCallback(p => {
    setProduct(prev => {
      if (!prev) history.pushState({ sheet: true }, '');
      return p;
    });
  }, []);

  const closeProduct = useCallback(() => {
    if (history.state?.sheet) history.back();
    else setProduct(null);
  }, []);

  useEffect(() => {
    const onPop = () => setProduct(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const value = useMemo(() => ({ product, openProduct, closeProduct }), [product, openProduct, closeProduct]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export const useMenu = () => useContext(MenuContext);
