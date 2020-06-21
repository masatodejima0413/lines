import { omit } from 'lodash';
import React, { useContext, useEffect, useRef } from 'react';
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import {
  DOWN_ARROW_KEY_CODE,
  RIGHT_ARROW_KEY_CODE,
  UP_ARROW_KEY_CODE,
} from '../../constants/keyCode';
import Item from '../../data/data_model/item';
import View from '../../data/data_model/view';
import { ViewContext } from '../context/ViewContextProvider';
import DraggableItem from '../item';
import { AddItemButton, SetContainer, SetHandle } from './set.styles';

export enum DragDropType {
  SET = 'SET',
  ITEM = 'ITEM',
}

interface IProps {
  setIndex: number;
  setId: string;
  isDraggingOverView: boolean;
}

const DraggableSet = ({ setId, setIndex, isDraggingOverView }: IProps) => {
  const addItemRef = useRef();
  const setHandleRef = useRef<HTMLDivElement>();

  const {
    currentView,
    setCurrentView,
    sets,
    setSets,
    items,
    setItems,
    itemRefs,
    itemHandleRefs,
    setHandleRefs,
    setSetHandleRefs,
    focussedItemId,
    setFocussedItemId,
  } = useContext(ViewContext);

  const prevSetId = currentView.setIds[setIndex - 1];
  const nextSetId = currentView.setIds[setIndex + 1];

  useEffect(() => {
    setSetHandleRefs((prev) => ({ ...prev, [setId]: setHandleRef }));
  }, []);

  const set = sets[setId];
  if (!set) return null;

  const deleteSet = () => {
    set.delete(currentView.id);
    setSets(omit(sets, [setId]));
    const updatedSetIds = currentView.setIds.filter((id) => id !== setId);
    setCurrentView((prev) => new View({ ...prev, setIds: updatedSetIds }));
    set.itemIds.forEach((itemId) => {
      setItems(omit(items, [itemId]));
    });
  };

  const addItem = () => {
    const newItem = new Item({});
    setItems((prev) => ({ ...prev, [newItem.id]: newItem }));
    setSets((prev) => ({
      ...prev,
      [setId]: set.addItem(newItem.id),
    }));
    newItem.save();
    setFocussedItemId(newItem.id);
  };

  const lastItemId = set.itemIds[set.itemIds.length - 1];
  const handleAddItemKeydown = (e) => {
    const { keyCode } = e;
    const lastItemRef = itemRefs[lastItemId];
    if (keyCode === UP_ARROW_KEY_CODE) {
      e.preventDefault();
      lastItemRef.current.focus();
    }
  };

  const setHandleKeydown = (e: React.KeyboardEvent<HTMLDivElement>, isDragging: boolean) => {
    if (isDragging) return;

    const { keyCode } = e;
    if (prevSetId && keyCode === UP_ARROW_KEY_CODE) {
      e.preventDefault();
      setHandleRefs[prevSetId].current.focus();
    }
    if (nextSetId && keyCode === DOWN_ARROW_KEY_CODE) {
      e.preventDefault();
      setHandleRefs[nextSetId].current.focus();
    }
    if (keyCode === RIGHT_ARROW_KEY_CODE) {
      e.preventDefault();
      itemHandleRefs[sets[setId].itemIds[0]].current.focus();
    }
  };

  const lastItem = items[set.itemIds[set.itemIds.length - 1]];
  const isLastItemEmpty = lastItem.text.length < 1;
  const isLastItemFocused = lastItemId === focussedItemId;

  return (
    <Draggable draggableId={setId} index={setIndex} key={setId}>
      {(
        setsDraggableProvided: DraggableProvided,
        setsDraggableSnapshot: DraggableStateSnapshot,
      ) => (
        <SetContainer
          className={`set ${isDraggingOverView ? 'dragging-over-view' : ''}`}
          {...setsDraggableProvided.draggableProps}
          ref={setsDraggableProvided.innerRef}
          isLastItemFocused={isLastItemFocused}
        >
          <SetHandle
            className="set-handle"
            {...setsDraggableProvided.dragHandleProps}
            ref={setHandleRef}
            onKeyDown={(e) => {
              setHandleKeydown(e, setsDraggableSnapshot.isDragging);
            }}
          />
          <Droppable droppableId={setId} type={DragDropType.ITEM}>
            {(
              itemsDroppableProvided: DroppableProvided,
              itemsDroppableSnapshot: DroppableStateSnapshot,
            ) => {
              return (
                <div
                  className={`item-droppable-container ${
                    itemsDroppableSnapshot.isDraggingOver ? 'dragging-over-set' : ''
                  } ${setsDraggableSnapshot.isDragging ? 'dragging' : ''}`}
                  ref={itemsDroppableProvided.innerRef}
                  {...itemsDroppableProvided.droppableProps}
                >
                  {set.itemIds.map((itemId, index) => {
                    return (
                      <DraggableItem
                        key={itemId}
                        itemId={itemId}
                        index={index}
                        setId={setId}
                        addItem={addItem}
                        deleteSet={deleteSet}
                        addItemRef={addItemRef}
                        setHandleRef={setHandleRef}
                        isDraggingOverSet={itemsDroppableSnapshot.isDraggingOver}
                      />
                    );
                  })}
                  {itemsDroppableProvided.placeholder}
                  {!isLastItemEmpty && (
                    <AddItemButton
                      ref={addItemRef}
                      onKeyDown={handleAddItemKeydown}
                      type="button"
                      className="add-item"
                      onClick={addItem}
                    >
                      + Add
                    </AddItemButton>
                  )}
                </div>
              );
            }}
          </Droppable>
        </SetContainer>
      )}
    </Draggable>
  );
};

export default DraggableSet;
