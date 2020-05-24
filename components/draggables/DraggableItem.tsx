import { omit } from 'lodash';
import React, { ChangeEvent, useContext, useRef } from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import { ViewContext } from '../context/ViewContextProvider';

interface IProps {
  itemId: string;
  index: number;
  setId: string;
  addItem: () => void;
}

const DraggableItem = ({ itemId, index, setId, addItem }: IProps) => {
  const { sets, setSets, items, setItems } = useContext(ViewContext);
  const itemRef = useRef<HTMLInputElement>();

  const item = items[itemId];
  if (!item) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setItems(prev => ({ ...prev, [itemId]: item.update(newText) }));
  };

  const deleteItem = () => {
    items[itemId].delete();
    setItems(omit(items, [itemId]));
    const updatedItemIds = sets[setId].itemIds.filter(argItemId => argItemId !== itemId);
    setSets(prev => ({ ...prev, [setId]: sets[setId].update(updatedItemIds) }));
  };

  const handleKeydown = e => {
    const { keyCode, metaKey, target } = e;
    // 8: Delete key
    if (metaKey && keyCode === 8 && !target.value) {
      deleteItem();
    }
    // 13: Enter key
    if (metaKey && keyCode === 13 && target.value.length) {
      addItem();
    }
    if (keyCode === 27) {
      // 27: Esc key
      itemRef.current.blur();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.addEventListener('keydown', handleKeydown);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.removeEventListener('keydown', handleKeydown);
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
            <input
              onFocus={handleFocus}
              onBlur={handleBlur}
              type="text"
              value={item.text}
              onChange={handleChange}
              ref={itemRef}
            />
            <div className="delete-item" onClick={deleteItem}>
              ×
            </div>
          </div>
        )}
      </Draggable>
      <style jsx>{`
        .item:first-of-type input {
          color: black;
        }
        .item input {
          height: 40px;
          width: 60vw;
          padding-left: 0.5rem;
          font-size: 2rem;
          color: #646464;
          font-weight: 800;
          border: none;
          transition: color 240ms ease-out;
        }
        .item {
          padding: 4px 0;
          display: flex;
          align-items: center;
        }
        .item .handle {
          width: 8px;
          align-self: stretch;
          background-color: lightgray;
          border-radius: 2px;
          opacity: 0;
          transition: opacity 80ms ease-out;
        }
        .item .handle:hover {
          opacity: 1;
        }
        .delete-item {
          cursor: pointer;
          font-size: 1.4rem;
          margin-right: 16px;
        }
      `}</style>
    </>
  );
};

export default DraggableItem;
