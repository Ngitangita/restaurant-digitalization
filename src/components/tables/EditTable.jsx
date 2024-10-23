

const EditTable = ({ tableToEdit, setTableToEdit, onSave, onCancel }) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">{tableToEdit.id ? 'Modifier' : 'Créer'} un Table</h2>
            <input
                type="number"
                placeholder="Numéro de la table"
                value={tableToEdit.number || ''}
                onChange={(e) => setTableToEdit({ ...tableToEdit, number: e.target.value })}
                className="mb-4 border rounded-md p-2 w-full"
            />
            <input
                type="number"
                placeholder="Capacité de la table"
                value={tableToEdit.capacity || ''}
                onChange={(e) => setTableToEdit({ ...tableToEdit, capacity: e.target.value })}
                className="mb-4 border rounded-md p-2 w-full"
            />

            <div className="flex justify-between">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    onClick={onSave}
                >
                    Enregistrer
                </button>
                <button
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Annuler
                </button>
            </div>
        </div>
    );
};

export default EditTable;
