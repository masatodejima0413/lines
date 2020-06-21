import React, { createContext, useState, RefObject, ReactNode } from 'react';
import View from '../../data/data_model/view';
import Item from '../../data/data_model/item';
import Set from '../../data/data_model/set';

interface IProps {
  currentView: View;
  setCurrentView: React.Dispatch<React.SetStateAction<View>>;
  sets: { [id: string]: Set };
  setSets: React.Dispatch<React.SetStateAction<{ [id: string]: Set }>>;
  items: { [id: string]: Item };
  setItems: React.Dispatch<React.SetStateAction<{ [id: string]: Item }>>;
  itemRefs: { [id: string]: RefObject<HTMLInputElement> };
  setItemRefs: React.Dispatch<
    React.SetStateAction<{
      [id: string]: React.RefObject<HTMLInputElement>;
    }>
  >;
  itemHandleRefs: { [id: string]: RefObject<HTMLDivElement> };
  setItemHandleRefs: React.Dispatch<
    React.SetStateAction<{
      [id: string]: React.RefObject<HTMLDivElement>;
    }>
  >;
  focussedItemId: string | null;
  setFocussedItemId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ViewContext = createContext<IProps>(null!);

export const ViewContextProvider = ({ children }: { children: ReactNode }) => {
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
