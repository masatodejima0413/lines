import styled from '@emotion/styled';
import { itemHeight } from '../item/item.styles';

export const SetContainer = styled('div')<{ isLastItemFocused: boolean }>`
  display: flex;
  padding: 20px 0;

  &:hover .set-handle {
    opacity: 1;
  }
  &:focus-within .add-item::before {
    content: 'Cmd + Enter to add';
    color: ${({ isLastItemFocused }) => (isLastItemFocused ? 'darkgray' : 'transparent')};
  }
  &:hover .add-item::before {
    content: 'Add item';
    color: darkgray;
  }
  &:focus-within .add-item:focus::before {
    content: 'Press Enter to add';
    color: darkgrey;
    text-decoration: underline;
  }
  &:focus-within .add-item:hover::before {
    content: 'Add item';
    color: darkgrey;
  }
  &:hover .add-item::before {
    content: 'Add item';
    color: darkgray;
  }
`;

export const SetHandle = styled('div')`
  width: 8px;
  align-self: stretch;
  background-color: black;
  opacity: 0;
  transition: opacity 80ms ease-out;
  margin-right: 8px;

  :hover,
  :focus {
    opacity: 1;
  }
`;

export const AddItemButton = styled('button')`
  background-color: transparent;
  color: transparent;
  font-size: 1rem;
  width: 60vw;
  line-height: ${itemHeight};
  padding: 4px 16px 4px;
  :hover {
    background-color: #f5f5f5;
  }
`;
