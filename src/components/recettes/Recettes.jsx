export default function Recettes() {
    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center items-center flex-col bg-white rounded p-5 text-gray-500">
                <div className="flex flex-col gap-4 items-center">
                    <div className="flex flex-row gap-3 items-center">
                        <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full" />
                        <div className='flex flex-col'>
                            <span className='text-2xl font-bold'>By Sooatel</span>
                            <span className='text-xs'>Ankasina Antananarivo <br /> Tel: 038 96 373 43</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold underline">Formulaire des recettes</h1>
                </div>
                <form className="flex w-[470px] flex-col justify-center gap-4 p-4 text-gray-700 rounded bg-white">
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="date">Date:</label>
                        <input type="datetime-local" id="date"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none" />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="numFacture">Numéro de facture</label>
                        <input type="number" id="numFacture"
                            placeholder="Numéro de facture"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none" />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="nom">Nom</label>
                        <input type="text" id="nom"
                            placeholder="Nom"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none" />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor='paymentMethod'>Mode de paiement</label>
                        <select id="paymentMethod" className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none">
                            <option value='espece'>Espèce</option>
                            <option value="mvola">Mvola</option>
                            <option value="liquide">Liquide</option>
                        </select>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="montant">Montant</label>
                        <input type="text" id="montant"
                            placeholder="Montant"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none" />
                    </div>
                    <div className="flex flex-row justify-evenly items-center">
                        <div className="flex flex-col justify-between items-center">
                            <label htmlFor="paye" className="text-gray-700">Payé</label>
                            <input type="radio" id="paye" name="paymentStatus" className="bg-slate-300 size-4 bg-opacity-15 rounded outline-none" />
                        </div>
                        <div className="flex flex-col justify-between items-center">
                            <label htmlFor="nonPaye" className="text-gray-700">Non payé</label>
                            <input type="radio" id="nonPaye" name="paymentStatus" className="size-4 bg-slate-300 bg-opacity-15 rounded outline-none" />
                        </div>
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg">
                        Enregistrer
                    </button>
                </form>
            </div>
        </div>
    );
}
