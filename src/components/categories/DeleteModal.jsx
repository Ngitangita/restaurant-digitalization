
const DeleteModal = ({ onDelete, onCancel }) => (
    <div>
        <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
        <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
        <div className="flex justify-around">
            <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={onDelete}
            >
                Supprimer
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

export default DeleteModal;