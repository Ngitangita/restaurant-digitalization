

const EditIngredients = ({units, ingredientName, setIngredientName, unitId, setUnitId, onSave, onCancel, error}) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Modifier l'ingrédient</h2>
      <input
        type="text"
        value={ingredientName}
        onChange={(e) => setIngredientName(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <select
        value={unitId}
        onChange={(e) => setUnitId(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option value="">Sélectionner une unité</option>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.abbreviation}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-end">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2" 
        onClick={onSave}>
          Mettre à jour
        </button>
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" 
        onClick={onCancel}>
          Annuler
        </button>
      </div>
    </div>
  )
}

export default EditIngredients
