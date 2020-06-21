import { Picker } from 'emoji-mart';
import React, { useEffect } from 'react';

interface IProps {
  onSelect: (emoji: any) => void;
  close: () => void;
}

const EmojiPicker = ({ onSelect, close }: IProps) => {
  const handleOutsideClick = (e: MouseEvent) => {
    const picker = document.getElementsByClassName('emoji-mart');

    if (picker && !picker[0].contains(e.target as Node)) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <Picker
      onSelect={onSelect}
      sheetSize={16}
      style={{ position: 'absolute', zIndex: '99', top: '50px' }}
    />
  );
};

export default EmojiPicker;
