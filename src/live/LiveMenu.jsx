import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { applyOverride, loadOverrides, subscribe } from './store';

const LiveContext = createContext({ overrides: {}, setOverrides: () => {} });

// Keeps the latest price/stock overrides and refreshes them live.
export function LiveMenuProvider({ children }) {
  const [overrides, setOverrides] = useState({});

  useEffect(() => {
    let alive = true;
    loadOverrides().then(o => alive && setOverrides(o || {})).catch(() => {});
    const off = subscribe(o => setOverrides(o || {}));
    return () => { alive = false; off(); };
  }, []);

  const value = useMemo(() => ({ overrides, setOverrides }), [overrides]);
  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export const useOverrides = () => useContext(LiveContext);

// The product with its live price and stock applied.
export function useLive(product) {
  const { overrides } = useContext(LiveContext);
  return product ? applyOverride(product, overrides[product.id]) : product;
}
