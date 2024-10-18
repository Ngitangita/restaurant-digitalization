

const UpdateStatus = ({menuStatus, statuses, setMenuStatus,  onSave, onCancel}) => {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Modifier le statut</h2>
            <select
                value={menuStatus}
                onChange={(e) => setMenuStatus(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
            <div className="flex justify-end">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
                    onClick={onSave}
                >
                    Sauvegarder
                </button>
                <button
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Annuler
                </button>
            </div>
        </div>
    )
}

export default UpdateStatus
