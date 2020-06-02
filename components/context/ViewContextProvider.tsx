import React, { createContext, useState, RefObject } from 'react';
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
  itemRefs: { [id: string]: RefObject<HTMLInputElement> };
  setItemRefs: React.Dispatch<React.SetStateAction<RefObject<HTMLInputElement>>>;
  handleRefs: { [id: string]: RefObject<HTMLInputElement> };
  setHandleRefs: React.Dispatch<React.SetStateAction<RefObject<HTMLInputElement>>>;
  focussedId: string;
  setFocussedId: React.Dispatch<React.SetStateAction<string>>;
}

// @ts-ignore
export const ViewContext = createContext<IProps>({});

export const ViewContextProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>();
  const [sets, setSets] = useState<{ [id: string]: Set }>({});
  const [items, setItems] = useState<{ [id: string]: Item }>({});
  const [itemRefs, setItemRefs] = useState<{ [id: string]: RefObject<HTMLInputElement> }>({});
  const [handleRefs, setHandleRefs] = useState<{ [id: string]: RefObject<HTMLInputElement> }>({});
  const [focussedId, setFocussedId] = useState<string>('');

  const value = {
    currentView,
    setCurrentView,
    sets,
    setSets,
    items,
    setItems,
    itemRefs,
    setItemRefs,
    handleRefs,
    setHandleRefs,
    focussedId,
    setFocussedId,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};
