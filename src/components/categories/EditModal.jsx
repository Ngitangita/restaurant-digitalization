import { useState } from "react";

const EditModal = ({onSave, onCancel, setCategoryToEdit, categoryToEdit }) => {

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Modifier la catégorie</h2>
            <input
                type="text"
                value={categoryToEdit.name || ''}
                onChange={(e) => setCategoryToEdit({...categoryToEdit, name: e.target.value})}
                className="p-2 border border-gray-300 rounded-md w-full mb-4"
            />
            <div className="flex justify-around">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={onSave}
                >
                    Sauvegarder
                </button>
                <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Annuler
                </button>
            </div>
        </div>

    );
};

export default EditModal;