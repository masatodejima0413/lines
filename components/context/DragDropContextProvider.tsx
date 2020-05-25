import React, { ReactNode } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DragDropType } from '../draggables/DraggableSet';
import View from '../../data/data_model/view';

interface IProps {
  currentView: any;
  setCurrentView: any;
  sets: any;
  setSets: any;
  children: ReactNode;
}

const DragDropContextProvider = ({
  currentView,
  setCurrentView,
  sets,
  setSets,
  children,
}: IProps) => {
  const onDragEnd = ({ source, destination, draggableId, type }: DropResult) => {
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      if (type === DragDropType.ITEM) {
        const set = sets[destination.droppableId];

        const updatedItemIds = move.inSameField({
          sourceIndex: source.index,
          destIndex: destination.index,
          draggableId,
          array: set.itemIds,
        });
        setSets(prev => ({ ...prev, [set.id]: set.update(updatedItemIds) }));
      }
      if (type === DragDropType.SET) {
        const updatedSetIds = move.inSameField({
          sourceIndex: source.index,
          destIndex: destination.index,
          draggableId,
          array: currentView.setIds,
        });
        // const updatedView = currentView.update(updatedSetIds);
        //  setCurrentView(updatedView)
        //  ↑ not working
        currentView.update(updatedSetIds);
        setCurrentView(prev => new View({ ...prev, setIds: updatedSetIds }));
      }
    } else {
      if (type === DragDropType.ITEM) {
        const sourceSet = sets[source.droppableId];
        const destSet = sets[destination.droppableId];
        const { startIds, finishIds } = move.toOtherField({
          source,
          destination,
          draggableId,
          sourceArray: sourceSet.itemIds,
          destArray: destSet.itemIds,
        });
        setSets(prev => ({
          ...prev,
          [sourceSet.id]: sourceSet.update(startIds),
          [destSet.id]: destSet.update(finishIds),
        }));
        return;
      }
      throw new Error('Invalid drag drop type');
    }
  };

  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
};

export default DragDropContextProvider;

const move = {
  inSameField: ({
    sourceIndex,
    destIndex,
    draggableId,
    array,
  }: {
    sourceIndex: number;
    destIndex: number;
    draggableId: string;
    array: string[];
  }) => {
    const ids = [...array];
    ids.splice(sourceIndex, 1);
    ids.splice(destIndex, 0, draggableId);
    return ids;
  },
  toOtherField: ({
    source,
    destination,
    draggableId,
    sourceArray,
    destArray,
  }: {
    source: any;
    destination: any;
    draggableId: string;
    sourceArray: string[];
    destArray: string[];
  }) => {
    console.log('one to anothoer move');
    const startIds = [...sourceArray];
    startIds.splice(source.index, 1);
    const finishIds = [...destArray];
    finishIds.splice(destination.index, 0, draggableId);
    return { startIds, finishIds };
  },
};
