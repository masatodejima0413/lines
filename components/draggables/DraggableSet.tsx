import { omit } from 'lodash';
import React from 'react';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import Item from '../../data/data_model/item';
import View from '../../data/data_model/view';
import DraggableItem from './DraggableItem';

export enum DragDropType {
  SET = 'SET',
  ITEM = 'ITEM',
}

interface IProps {
  currentView: any;
  setCurrentView: any;
  setIndex: any;
  setId: any;
  sets: any;
  setSets: any;
  items: any;
  setItems: any;
}

const DraggableSet = ({
  currentView,
  setCurrentView,
  setIndex,
  setId,
  sets,
  setSets,
  items,
  setItems,
}: IProps) => {
  const set = sets[setId];
  if (!set) return null;

  const deleteSet = () => {
    sets[setId].delete(currentView.id);
    setSets(omit(sets, setId));
    const updatedSetIds = currentView.setIds.filter(argSetId => argSetId !== setId);
    setCurrentView(prev => new View({ ...prev, setIds: updatedSetIds }));
    sets[setId].itemIds.forEach(itemId => {
      setItems(omit(items, itemId));
    });
  };

  const addItem = () => {
    const newItem = new Item({});
    setItems(prev => ({ ...prev, [newItem.id]: newItem }));
    newItem.save();
    setSets(prev => ({
      ...prev,
      [setId]: sets[setId].addItem(newItem.id),
    }));
  };

  return (
    <>
      <Draggable draggableId={setId} index={setIndex} key={setId}>
        {(setsDraggableProvided: DraggableProvided) => (
          <div
            className="set"
            {...setsDraggableProvided.draggableProps}
            ref={setsDraggableProvided.innerRef}
          >
            <div {...setsDraggableProvided.dragHandleProps}>[setHandle]</div>
            <button type="button" onClick={() => deleteSet()}>
              -
            </button>

            <Droppable droppableId={setId} direction="horizontal" type={DragDropType.ITEM}>
              {(itemsDroppableProvided: DroppableProvided) => (
                <div
                  className="item-droppable-container"
                  ref={itemsDroppableProvided.innerRef}
                  {...itemsDroppableProvided.droppableProps}
                >
                  {set.itemIds.map((itemId, index) => {
                    return (
                      <DraggableItem
                        key={itemId}
                        id={itemId}
                        index={index}
                        items={items}
                        setItems={setItems}
                        setId={setId}
                        sets={sets}
                        setSets={setSets}
                      />
                    );
                  })}
                  {itemsDroppableProvided.placeholder}
                </div>
              )}
            </Droppable>

            <button type="button" onClick={addItem}>
              +
            </button>
          </div>
        )}
      </Draggable>
      <style jsx>{`
        .set {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          border-left: 0.5rem solid #c4c4c4;
          font-weight: bold;
        }
        .item-droppable-container {
          display: flex;
        }
        .set button {
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default DraggableSet;