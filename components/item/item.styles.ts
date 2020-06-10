import styled from '@emotion/styled';

export const itemHeight = '42px';

export const ItemContainer = styled('div')`
  padding: 4px 0;
  display: flex;
  align-items: center;
  :hover {
    .handle {
      opacity: 1;
    }
    .delete-item {
      opacity: 0.4;
    }
  }
`;

export const ItemInput = styled('input')<{ isDragging: boolean }>`
  height: ${itemHeight};
  width: 60vw;
  padding-left: 0.5rem;
  font-size: 2rem;
  color: #646464;
  font-weight: 800;
  border: none;
  transition: color 240ms ease-out;
  transition: box-shadow 240ms ease-out;
  &::placeholder {
    opacity: 0;
  }
  &:focus::placeholder {
    font-weight: 400;
    font-size: 1rem;
    opacity: 0.6;
  }
  box-shadow: ${({ isDragging }) => (isDragging ? `0 0 15px rgba(0, 0, 0, 0.3)` : ``)};
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
  width: 8px;
  align-self: stretch;
  background-color: lightgray;
  opacity: 0;
  transition: opacity 80ms ease-out;
  :hover,
  :focus {
    opacity: 1;
  }
`;
