import axios from 'axios';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

const API_URL = 'http://127.0.0.1:8000/farm/farm/';
interface Farm {
  id: string;
  name: string;
}

interface FarmContextType {
  farms: Farm[];
  activeFarm: Farm | null;
  setActiveFarm: (farm: Farm) => void;
  updateFarms: (farms: Farm[]) => void; // Method to update the list of farms
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider = ({ children }: { children: ReactNode }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeFarm, setActiveFarm] = useState<Farm | null>(null);

  const updateFarms = (newFarms: Farm[]) => {
    setFarms(newFarms);
    
      setActiveFarm(newFarms[0]);
    
  };

  const initializeFarms = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get<Farm[]>(API_URL, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('Fetched farms:', response.data);
      updateFarms(response.data);
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  useEffect(() => {
    initializeFarms();
  }, []);

  return (
    <FarmContext.Provider
      value={{ farms, activeFarm, setActiveFarm, updateFarms }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (context === undefined) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
