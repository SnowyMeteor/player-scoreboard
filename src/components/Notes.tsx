import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import '../style/Notes.css';

interface NotesProps {
    value: string;
    onChange: (value: string) => void;
}

const Notes: React.FC<NotesProps> = ({ value, onChange }) => {
    return (
        <div className="note-container">
            <div className="note-item">
                <label htmlFor="notes" className="block font-bold mb-2 text-left">註記</label>
                <InputTextarea
                    id="notes"
                    rows={5}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="輸入註記..."
                    autoResize
                    className="input-textarea text-left"
                />
            </div>
        </div>
    );
}

export default Notes;