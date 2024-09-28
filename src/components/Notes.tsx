import React, { useEffect, useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import '../style/Notes.css';

interface NotesProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

const Notes: React.FC<NotesProps> = ({ value, onChange, readOnly = false }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
        }
    }, [value]);

    const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        adjustTextareaHeight(e.target);
    };

    return (
        <div className="note-container">
            <div className="note-item">
                <label htmlFor="notes" className="block font-bold mb-2 text-left">註記</label>
                <InputTextarea
                    ref={textareaRef}
                    id="notes"
                    value={value}
                    onChange={handleChange}
                    placeholder={readOnly ? "" : "輸入註記..."}
                    className="input-textarea text-left"
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
}

export default Notes;