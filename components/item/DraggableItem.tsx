import { Emoji, Picker } from 'emoji-mart';
import { omit } from 'lodash';
import React, { ChangeEvent, RefObject, useContext, useEffect, useRef, useState } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import {
  DELETE_KEY_CODE,
  DOWN_ARROW_KEY_CODE,
  ENTER_KEY_CODE,
  ESC_KEY_CODE,
  LEFT_ARROW_KEY_CODE,
  RIGHT_ARROW_KEY_CODE,
  UP_ARROW_KEY_CODE,
} from '../../constants/keyCode';
import { ViewContext } from '../context/ViewContextProvider';
import { DeleteButton, ItemContainer, ItemHandle, ItemInput, StyledPicker } from './item.styles';

interface IProps {
  itemId: string;
  index: number;
  setId: string;
  addItem: () => void;
  deleteSet: () => void;
  addItemRef: RefObject<HTMLButtonElement>;
  setHandleRef: RefObject<HTMLDivElement>;
  isDraggingOverSet: boolean;
}

const DraggableItem = ({
  itemId,
  index,
  setId,
  addItem,
  deleteSet,
  addItemRef,
  setHandleRef,
  isDraggingOverSet,
}: IProps) => {
  const {
    sets,
    setSets,
    items,
    setItems,
    itemRefs,
    setItemRefs,
    itemHandleRefs,
    setItemHandleRefs,
    focussedItemId,
    setFocussedItemId,
  } = useContext(ViewContext);
  const set = sets[setId];
  const item = items[itemId];
  const itemRef = useRef<HTMLInputElement>();
  const handleRef = useRef<HTMLDivElement>();
  const isFirstItem = index === 0;
  const isLastItem = index === set.itemIds.length - 1;
  const prevItemId = set.itemIds[index - 1];
  const nextItemId = set.itemIds[index + 1];

  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);

  useEffect(() => {
    setItemRefs((prev) => ({ ...prev, [itemId]: itemRef }));
    setItemHandleRefs((prev) => ({ ...prev, [itemId]: handleRef }));
    if (focussedItemId === itemId) {
      itemRef.current.focus();
    }
  }, []);

  if (!item) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setItems((prev) => ({ ...prev, [itemId]: item.update(newText) }));
  };

  const deleteItem = () => {
    items[itemId].delete();
    setItems(omit(items, [itemId]));
    const updatedItemIds = sets[setId].itemIds.filter((id) => id !== itemId);
    if (updatedItemIds.length > 0) {
      setSets((prev) => ({ ...prev, [setId]: sets[setId].update(updatedItemIds) }));
    } else {
      deleteSet();
    }
  };

  const inputKeydown = (e) => {
    const { keyCode, metaKey, target } = e;

    if (metaKey && keyCode === DELETE_KEY_CODE && !target.value) {
      e.preventDefault();
      deleteItem();
      setFocussedItemId(null);
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
    if (keyCode === LEFT_ARROW_KEY_CODE) {
      if (itemRef.current.selectionStart === 0 && itemRef.current.selectionEnd === 0) {
        e.preventDefault();
        itemHandleRefs[itemId].current.focus();
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const trimmedText = e.target.value.trim();
    if (item.text !== trimmedText) {
      setItems((prev) => ({ ...prev, [itemId]: item.update(trimmedText) }));
    }
    setFocussedItemId(null);
  };

  const itemHandleKeydown = (e: React.KeyboardEvent<HTMLDivElement>, isDragging: boolean) => {
    if (isDragging) return;
    const { keyCode } = e;

    if (prevItemId && keyCode === UP_ARROW_KEY_CODE) {
      e.preventDefault();
      itemHandleRefs[prevItemId].current.focus();
    }
    if (nextItemId && keyCode === DOWN_ARROW_KEY_CODE) {
      e.preventDefault();
      itemHandleRefs[nextItemId].current.focus();
    }

    if (keyCode === RIGHT_ARROW_KEY_CODE) {
      e.preventDefault();
      itemRefs[itemId].current.focus();
    }
    if (keyCode === LEFT_ARROW_KEY_CODE) {
      e.preventDefault();
      setHandleRef.current.focus();
    }
  };

  const selectEmoji = (emoji) => {
    setItems((prev) => ({ ...prev, [itemId]: item.updateEmojiId(emoji.id) }));
    setIsOpenEmojiPicker(!isOpenEmojiPicker);
  };

  return (
    <Draggable key={itemId} draggableId={itemId} index={index}>
      {(
        itemsDraggableProvided: DraggableProvided,
        itemsDraggableSnapshot: DraggableStateSnapshot,
      ) => (
        <ItemContainer
          className="item"
          {...itemsDraggableProvided.draggableProps}
          ref={itemsDraggableProvided.innerRef}
        >
          <ItemHandle
            className="handle"
            isDraggingOverSet={isDraggingOverSet}
            {...itemsDraggableProvided.dragHandleProps}
            ref={handleRef}
            onKeyDown={(e) => {
              itemHandleKeydown(e, itemsDraggableSnapshot.isDragging);
            }}
          />
          <Emoji
            emoji={item.emojiId}
            size={24}
            onClick={() => setIsOpenEmojiPicker(!isOpenEmojiPicker)}
          />
          {isOpenEmojiPicker && (
            <Picker
              title="Pick your emoji…"
              emoji="point_up"
              onSelect={(emoji) => selectEmoji(emoji)}
              style={{ position: 'absolute', zIndex: '99', left: '50px', top: '50px' }}
            />
          )}
          <ItemInput
            type="text"
            placeholder="Cmd + Del to delete"
            ref={itemRef}
            onKeyDown={inputKeydown}
            value={item.text}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => setFocussedItemId(itemId)}
            isFirstItem={isFirstItem}
            isDragging={itemsDraggableSnapshot.isDragging}
          />
          <DeleteButton tabIndex={-1} type="button" className="delete-item" onClick={deleteItem}>
            Delete
          </DeleteButton>
        </ItemContainer>
      )}
    </Draggable>
  );
};

export default DraggableItem;
