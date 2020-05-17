import { omit } from 'lodash';
import React, { ChangeEvent, useContext } from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { ViewContext } from '../context/ViewContextProvider';

interface IProps {
  itemId: string;
  index: number;
  setId: string;
}

const DraggableItem = ({ itemId, index, setId }: IProps) => {
  const { sets, setSets, items, setItems } = useContext(ViewContext);

  const item = items[itemId];
  if (!item) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setItems(prev => ({ ...prev, [itemId]: item.update(newText) }));
  };

  const deleteItem = () => {
    items[itemId].delete();
    setItems(omit(items, itemId));
    const updatedItemIds = sets[setId].itemIds.filter(argItemId => argItemId !== itemId);
    setSets(prev => ({ ...prev, [setId]: sets[setId].update(updatedItemIds) }));
  };

  return (
    <>
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(itemsDraggableProvided: DraggableProvided) => (
          <div
            className="item"
            {...itemsDraggableProvided.draggableProps}
            ref={itemsDraggableProvided.innerRef}
          >
            <div className="handle" {...itemsDraggableProvided.dragHandleProps} />
            <input type="text" value={item.text} onChange={handleChange} />
            <div className="delete" onClick={deleteItem}>
              ×
            </div>
          </div>
        )}
      </Draggable>
      <style jsx>{`
        .item:first-of-type input {
          font-size: 2rem;
          font-weight: bold;
          border: none;
        }
        .item input {
          font-size: 1rem;
          font-weight: bold;
          border: none;
          padding-left: 0.5rem;
        }
        .item {
          display: flex;
          align-items: center;
          margin-left: 12px;
        }
        .item .handle {
          width: 12px;
          height: 80%;
          background-color: lightgray;
          border-radius: 2px;
        }
        .item .delete {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default DraggableItem;
