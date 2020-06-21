import styled from '@emotion/styled';

export const itemHeight = '48px';
export const borderWidth = '4px';

export const ItemContainer = styled('div')`
  padding: 0px 0;
  display: flex;
  align-items: center;
  position: relative;
  :hover {
    .handle {
      opacity: 1;
    }
    .delete-item {
      opacity: 0.4;
    }
  }
`;

export const ItemInput = styled('input')<{ isDragging: boolean; isFirstItem: boolean }>`
  height: ${itemHeight};
  width: 80vw;
  padding-left: 0.5rem;
  font-size: 2rem;
  color: ${({ isFirstItem }) => (isFirstItem ? '#000' : '#646464')};
  font-weight: 800;
  border: none;
  transition: color 240ms ease-out;
  transition: box-shadow 240ms ease-out;
  box-shadow: ${({ isDragging }) => (isDragging ? `0 0 15px rgba(0, 0, 0, 0.3)` : ``)};
  border: transparent solid ${borderWidth};
  &::placeholder {
    opacity: 0;
  }
  &:focus::placeholder {
    font-weight: 400;
    font-size: 1rem;
    opacity: 0.6;
  }
  &:focus {
    border: black solid ${borderWidth};
  }
`;

export const DeleteButton = styled('button')`
  opacity: 0;
  line-height: ${itemHeight};
  cursor: pointer;
  font-size: 1rem;
  margin-right: 16px;
  :hover {
    text-decoration: underline;
  }
`;

export const ItemHandle = styled('div')<{ isDraggingOverSet: boolean }>`
  width: 16px;
  height: ${itemHeight};
  background-color: #000;
  border: black solid 4px;
  opacity: 0;
  :hover,
  :focus {
    opacity: 1;
    background-color: #fff;
  }
`;
