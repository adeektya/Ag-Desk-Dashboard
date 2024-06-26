import axios from 'axios';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import BASE_URL from '../../config';  // Adjust the path as needed

const API_URL = `${BASE_URL}/farm/farm/`;
interface Farm {
  id: string;
  name: string;
  address: string;
}

interface FarmContextType {
  farms: Farm[];
  activeFarm: Farm | null;
  setActiveFarm: (farm: Farm) => void;
  updateFarms: (farms: Farm[]) => void; // Method to update the list of farms
  clearStates:()=> void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider = ({ children }: { children: ReactNode }) => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activeFarm, setActiveFarm] = useState<Farm | null>(null);
  const clearStates=()=>{
    console.log("entring clear state")
    setFarms([]);
    setActiveFarm(null);


  }

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
      value={{ farms, activeFarm, setActiveFarm, updateFarms,clearStates }}
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
