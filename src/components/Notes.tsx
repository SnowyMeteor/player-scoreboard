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
        // Adjust the height of the textarea whenever the value changes
        if (textareaRef.current) {
            adjustTextareaHeight(textareaRef.current);
        }
    }, [value]);

    // Function to adjust the height of the textarea based on its content
    const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
        element.style.height = 'auto'; // Reset height to auto to calculate new height
        element.style.height = `${element.scrollHeight}px`;
    };

    // Handle change event for the textarea
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