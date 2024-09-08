

export default function CreateFacture() {
    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center text-gray-500 items-center flex-col bg-white rounded p-5 pt-5 pb-16">
                <div className="flex flex-col gap-4 items-center">
                    <div className="flex flex-row gap-3 items-center">
                        <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full" />
                        <div className='flex flex-col'>
                            <span className='text-2xl font-bold'>By Sooatel</span>
                            <span className='text-xs'>Ankasina Antananarivo <br /> Tel: 038 96 373 43</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold underline">Facture</h1>
                </div>
                <form className="flex flex-col justify-center gap-4 p-4 text-gray-700 rounded bg-white">
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="date">Date:</label>
                        <input type="datetime-local" id="date"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="Droit">Droit:</label>
                        <input type="number" id="Droit"
                            placeholder="droit"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="table">N° de table:</label>
                        <input type="number" id="table"
                            placeholder="numero de table"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="chambre">Chambre:</label>
                        <input type="number" id="chambre"
                            placeholder="numero du chambre"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="quantity">Quantités:</label>
                        <input type="number" id="quantity"
                            placeholder="quantités de la désignation"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="designation">Désignation:</label>
                        <input type="text" id="designation"
                            placeholder="désignation"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="prix">Prix Uniter:</label>
                        <input type="text" id="prix"
                            placeholder="prix uniter"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="montant">Montant:</label>
                        <input type="number" id="montant"
                            placeholder="montant"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span>Montant total: ................</span>
                            <p>Somme arrêtée à la présente liste de ................</p>
                        </div>
                        <div className="flex flex-row gap-40">
                            <span className="underline">Lersponsable</span>
                            <span className="underline">Client</span>
                        </div>
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg">
                        Envoyez
                    </button>
                </form>
            </div>
        </div>
    )
}
