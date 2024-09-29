

const Payment = () => {
  return (
    <div id="Payment" className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <form className="space-y-4">
        {/* Champ pour la date du paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="payment_date">
            Date payment:
          </label>
          <input 
            id="payment_date" 
            type="date" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>

        {/* Sélection du mode de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="payment_method">
            Payment method:
          </label>
          <select 
            id="payment_method" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
            <option value="Bank transfer">Bank transfer</option>
            <option value="Mvola mobile money service">Mvola mobile money service</option>
            <option value="PayPal">PayPal</option>
            <option value="Credit and debit cards">Credit and debit cards</option>
            <option value="Apple Pay">Apple Pay</option>
            <option value="Google Pay">Google Pay</option>
            <option value="Samsung Pay">Samsung Pay</option>
            <option value="Cryptocurrencies">Cryptocurrencies</option>
            <option value="Gift cards and prepaid cards">Gift cards and prepaid cards</option>
            <option value="Cash on delivery">Cash on delivery</option>
            <option value="Stripe">Stripe</option>
            <option value="Square">Square</option>
            <option value="Braintree">Braintree</option>
            <option value="Money order">Money order</option>
            <option value="Mobile wallets">Mobile wallets</option>
            <option value="WeChatPay">WeChatPay</option>
          </select>
        </div>

        {/* Champ pour le montant payé */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="amount">
            Amount paid:
          </label>
          <input 
            id="amount" 
            type="number" 
            step="0.01" 
            placeholder="Enter amount" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Statut du paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="status">
            Payment Status:
          </label>
          <select 
            id="status" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Description:
          </label>
          <textarea 
            id="description" 
            placeholder="Optional description..." 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Boutons d'envoi et d'annulation */}
        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
          <button 
            type="button" 
            className="w-full bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
