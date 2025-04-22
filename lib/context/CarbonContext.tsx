import { createContext, useContext, useState, ReactNode } from "react";

interface CarbonContextType {
  totalCO2: number;
  setTotalCO2: (value: number) => void;
}

const CarbonContext = createContext<CarbonContextType | null>(null);

export const CarbonProvider = ({ children }: { children: ReactNode }) => {
  const [totalCO2, setTotalCO2] = useState(0);

  return (
    <CarbonContext.Provider value={{ totalCO2, setTotalCO2 }}>
      {children}
    </CarbonContext.Provider>
  );
};

export const useCarbon = () => {
  const context = useContext(CarbonContext);
  if (!context) throw new Error("useCarbon must be used within CarbonProvider");
  return context;
};
