import { omit } from 'lodash';
import React, { ChangeEvent } from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import Item from '../../data/data_model/item';
import Set from '../../data/data_model/set';

interface IProps {
  id: string;
  index: number;
  items: { [id: string]: Item };
  setItems: any;
  setId: string;
  sets: { [id: string]: Set };
  setSets: any;
}

const DraggableItem = ({ id, index, items, setItems, sets, setId, setSets }: IProps) => {
  const item = items[id];
  if (!item) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setItems(prev => ({ ...prev, [id]: item.update(newText) }));
  };

  const deleteItem = (itemId: string) => {
    items[itemId].delete();
    setItems(omit(items, itemId));
    const updatedItemIds = sets[setId].itemIds.filter(argItemId => argItemId !== itemId);
    setSets(prev => ({ ...prev, [setId]: sets[setId].update(updatedItemIds) }));
  };

  return (
    <>
      <Draggable key={id} draggableId={id} index={index}>
        {(itemsDraggableProvided: DraggableProvided) => (
          <div
            className="item"
            {...itemsDraggableProvided.draggableProps}
            ref={itemsDraggableProvided.innerRef}
          >
            <div className="handle" {...itemsDraggableProvided.dragHandleProps} />
            <input type="text" value={item.text} onChange={handleChange} />
            <div className="delete" onClick={() => deleteItem(id)}>
              ×
            </div>
          </div>
        )}
      </Draggable>
      <style jsx>{`
        .item:first-of-type input {
          height: 2.5rem;
          font-size: 2rem;
          margin: 1rem;
          border: none;
        }
        .item input {
          font-size: 1rem;
          height: 1.2rem;
          border: none;
          padding-left: 0.5rem;
          border-left: 0.2rem solid #c4c4c4;
          margin: 0.1rem;
        }
        .item {
          display: flex;
          align-items: center;
        }
        .item .handle {
          width: 20px;
          height: 20px;
          background-color: #ffddd2;
          border-radius: 5px;
        }
        .item .delete {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default DraggableItem;
