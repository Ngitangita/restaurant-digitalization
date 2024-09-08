
const states = [
  { value: 'madagascar', label: 'Madagascar' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
];

export default function AccountDetails() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="bg-white p-6 rounded-lg shadow-md space-y-6 text-gray-500"
    >
      <div>
        <h3 className="text-lg font-semibold">Profile</h3>
        <p className="text-sm text-gray-500">The information can be edited</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">First name</label>
          <input
            type="text"
            placeholder="your firstname"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Last name</label>
          <input
            type="text"
            placeholder="your lastname"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email address</label>
          <input
            type="email"
            placeholder="your email address"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone number</label>
          <input
            type="tel"
            placeholder="enter your phone number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">State</label>
          <select
            defaultValue="madagascar"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            placeholder="your city"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
      <button
          type="submit"
          className="px-4 py-2 border border-gray-500 text-gray-500 rounded-md hover:bg-gray-100"
        >
           Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save details
        </button>
      </div>
    </form>
  );
}
