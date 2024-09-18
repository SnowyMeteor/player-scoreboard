import React from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import '../style/Notes.css';

const Notes = () => {
    return (
        <div className="note-container">
            <div className="note-item">
                <label htmlFor="notes" className="block font-bold mb-2 text-left">註記</label>
                <InputTextarea
                    id="notes"
                    rows={5}
                    placeholder="輸入註記"
                    autoResize
                    className="input-textarea text-left"
                />
            </div>
        </div>
    );
}

export default Notes;
