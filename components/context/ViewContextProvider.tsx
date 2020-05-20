import React, { createContext, useState } from 'react';
import View from '../../data/data_model/view';
import Item from '../../data/data_model/item';
import Set from '../../data/data_model/set';

interface IProps {
  currentView: View;
  setCurrentView: React.Dispatch<React.SetStateAction<View>>;
  sets: { [id: string]: Set };
  setSets: React.Dispatch<React.SetStateAction<Set>>;
  items: { [id: string]: Item };
  setItems: React.Dispatch<React.SetStateAction<Item>>;
}

// @ts-ignore
export const ViewContext = createContext<IProps>({});

export const ViewContextProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>();
  const [items, setItems] = useState<{ [id: string]: Item }>({});
  const [sets, setSets] = useState<{ [id: string]: Set }>({});

  const value = {
    currentView,
    setCurrentView,
    items,
    setItems,
    sets,
    setSets,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};
