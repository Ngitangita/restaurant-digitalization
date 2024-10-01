

export function UpdatePassword() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="UpdatePassword bg-white p-6 rounded-lg shadow-md space-y-6 text-gray-500 mb-20"
    >
      <div>
        <h3 className="text-lg font-semibold">Mot de passe</h3>
        <p className="text-sm text-gray-500">Mettre à jour le mot de passe</p>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            name="password"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmPassword"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
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
          Mettre à jour
        </button>
      </div>
    </form>
  );
}
