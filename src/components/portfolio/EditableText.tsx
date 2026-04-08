import React, { useRef, useEffect } from 'react';

interface EditableTextProps {
  id: string;
  isEditing: boolean;
  value: string;
  onChange: (id: string, html: string) => void;
  className?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ id, isEditing, value, onChange, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={(e) => onChange(id, e.currentTarget.innerHTML)}
      className={`${className} outline-none transition-all ${isEditing ? 'cursor-text focus:ring-2 focus:ring-accent focus:ring-offset-4 rounded' : 'cursor-default'}`}
      title={isEditing ? 'Clique para editar' : ''}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default EditableText;
