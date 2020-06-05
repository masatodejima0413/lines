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
  itemHandleRefs: { [id: string]: RefObject<HTMLInputElement> };
  setItemHandleRefs: React.Dispatch<React.SetStateAction<RefObject<HTMLInputElement>>>;
  focussedItemId: string | null;
  setFocussedItemId: React.Dispatch<React.SetStateAction<string | null>>;
}

// @ts-ignore
export const ViewContext = createContext<IProps>({});

export const ViewContextProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>();
  const [sets, setSets] = useState<{ [id: string]: Set }>({});
  const [items, setItems] = useState<{ [id: string]: Item }>({});
  const [itemRefs, setItemRefs] = useState<{ [id: string]: RefObject<HTMLInputElement> }>({});
  const [itemHandleRefs, setItemHandleRefs] = useState<{
    [id: string]: RefObject<HTMLDivElement>;
  }>({});
  const [setHandleRefs, setSetHandleRefs] = useState<{ [id: string]: RefObject<HTMLDivElement> }>(
    {},
  );

  const [focussedItemId, setFocussedItemId] = useState<string>('');

  const value = {
    currentView,
    setCurrentView,
    sets,
    setSets,
    items,
    setItems,
    itemRefs,
    setItemRefs,
    itemHandleRefs,
    setItemHandleRefs,
    setHandleRefs,
    setSetHandleRefs,
    focussedItemId,
    setFocussedItemId,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
};
