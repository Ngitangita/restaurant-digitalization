

export function Notifications() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="Notifications bg-white p-6 rounded-lg shadow-md space-y-6 text-gray-500"
    >
      <div>
        <h3 className="text-lg font-semibold">Notifications</h3>
        <p className="text-sm text-gray-500">Gérer les notifications</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-semibold">Email</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="form-checkbox" />
              <span>Mises à jour des produits</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Mises à jour de sécurité</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold">Téléphone</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="form-checkbox" />
              <span>Par email</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Mises à jour de sécurité</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="px-4 py-2 border border-gray-500 text-gray-500 rounded-md hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
