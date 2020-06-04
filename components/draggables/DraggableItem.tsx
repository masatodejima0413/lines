import { omit } from 'lodash';
import React, { ChangeEvent, useContext, useRef, useEffect, RefObject } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { ViewContext } from '../context/ViewContextProvider';
import {
  DELETE_KEY_CODE,
  ENTER_KEY_CODE,
  ESC_KEY_CODE,
  UP_ARROW_KEY_CODE,
  DOWN_ARROW_KEY_CODE,
} from '../../constants/keyCode';

interface IProps {
  itemId: string;
  index: number;
  setId: string;
  addItem: () => void;
  deleteSet: () => void;
  addItemRef: RefObject<HTMLButtonElement>;
  isDraggingOverSet: boolean;
}

const DraggableItem = ({
  itemId,
  index,
  setId,
  addItem,
  deleteSet,
  addItemRef,
  isDraggingOverSet,
}: IProps) => {
  const {
    sets,
    setSets,
    items,
    setItems,
    itemRefs,
    setItemRefs,
    handleRefs,
    setHandleRefs,
    focussedId,
  } = useContext(ViewContext);
  const set = sets[setId];
  const item = items[itemId];
  const itemRef = useRef<HTMLInputElement>();
  const handleRef = useRef<HTMLDivElement>();
  const isFirstItem = index === 0;
  const isLastItem = index === set.itemIds.length - 1;
  const prevItemId = set.itemIds[index - 1];
  const nextItemId = set.itemIds[index + 1];

  useEffect(() => {
    setItemRefs(prev => ({ ...prev, [itemId]: itemRef }));
    setHandleRefs(prev => ({ ...prev, [itemId]: handleRef }));
    if (focussedId === itemId) {
      itemRef.current.focus();
    }
  }, []);

  if (!item) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setItems(prev => ({ ...prev, [itemId]: item.update(newText) }));
  };

  const deleteItem = () => {
    items[itemId].delete();
    setItems(omit(items, [itemId]));
    const updatedItemIds = sets[setId].itemIds.filter(id => id !== itemId);
    if (updatedItemIds.length > 0) {
      setSets(prev => ({ ...prev, [setId]: sets[setId].update(updatedItemIds) }));
    } else {
      deleteSet();
    }
  };

  const handleKeydown = e => {
    const { keyCode, metaKey, target } = e;

    if (metaKey && keyCode === DELETE_KEY_CODE && !target.value) {
      e.preventDefault();
      deleteItem();
      if (!isFirstItem) {
        itemRefs[prevItemId].current.focus();
      }
    }
    if (metaKey && keyCode === ENTER_KEY_CODE && target.value.length) {
      if (isLastItem) {
        addItem();
      } else {
        itemRefs[nextItemId].current.focus();
      }
    }
    if (keyCode === ESC_KEY_CODE) {
      itemRef.current.blur();
    }
    if (prevItemId && keyCode === UP_ARROW_KEY_CODE) {
      e.preventDefault();
      itemRefs[prevItemId].current.focus();
    }
    if (keyCode === DOWN_ARROW_KEY_CODE) {
      e.preventDefault();
      if (nextItemId) {
        itemRefs[nextItemId].current.focus();
      }
      if (isLastItem && item.text.length) {
        addItemRef.current.focus();
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmedText = e.target.value.trim();
    if (item.text !== trimmedText) {
      setItems(prev => ({ ...prev, [itemId]: item.update(trimmedText) }));
    }
  };

  const handleHandleKeydown = e => {
    const { keyCode } = e;

    if (prevItemId && keyCode === UP_ARROW_KEY_CODE) {
      e.preventDefault();
      handleRefs[prevItemId].current.focus();
    }
    if (nextItemId && keyCode === DOWN_ARROW_KEY_CODE) {
      e.preventDefault();
      handleRefs[nextItemId].current.focus();
    }
  };

  return (
    <>
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(
          itemsDraggableProvided: DraggableProvided,
          itemsDraggableSnapshot: DraggableStateSnapshot,
        ) => (
          <div
            className={`item ${itemsDraggableSnapshot.isDragging ? 'dragging' : ''} ${
              isDraggingOverSet ? 'dragging-over-set' : ''
            }`}
            {...itemsDraggableProvided.draggableProps}
            ref={itemsDraggableProvided.innerRef}
          >
            <div
              className="handle"
              {...itemsDraggableProvided.dragHandleProps}
              ref={handleRef}
              onKeyDown={itemsDraggableSnapshot.isDragging ? null : handleHandleKeydown}
            />
            <input
              type="text"
              ref={itemRef}
              onKeyDown={handleKeydown}
              value={item.text}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button tabIndex={-1} type="button" className="delete-item" onClick={deleteItem}>
              Delete
            </button>
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
          transition: box-shadow 240ms ease-out;
        }
        .dragging input {
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
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
          opacity: 0;
          transition: opacity 80ms ease-out;
        }
        .item .handle:hover,
        .item .handle:focus {
          opacity: 1;
        }
        .item:hover .handle {
          opacity: 1;
        }
        .dragging-over-set:hover .handle {
          opacity: 0;
        }
        .delete-item {
          opacity: 0;
          line-height: 40px;
          cursor: pointer;
          font-size: 1rem;
          margin-right: 16px;
        }
        .delete-item:hover {
          text-decoration: underline;
        }
        .item:hover .delete-item {
          opacity: 0.4;
        }
      `}</style>
    </>
  );
};

export default DraggableItem;
