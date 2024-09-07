
export default function Recettes() {
    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center items-center flex-col bg-white rounded p-5">
                <div className="flex flex-col gap-4 items-center">
                    <div className="flex flex-row gap-3 items-center">
                        <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full" />
                        <div className='flex flex-col'>
                            <span className='text-2xl font-bold'>By Sooatel</span>
                            <span className='text-xs'>Ankasina Antananarivo <br /> Tel: 038 96 373 43</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold underline">Formulair du recettes</h1>
                </div>
                <form className="flex w-[470px] flex-col justify-center gap-4 p-4 text-gray-700 rounded bg-white">
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="date">Date:</label>
                        <input type="datetime-local" id="date"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="numFacture">Numero du fancture</label>
                        <input type="number" id="numFacture"
                            placeholder="Numero du fancture"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="nom">Nom</label>
                        <input type="text" id="nom"
                            placeholder="nom"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="payement">Mode du payement</label>
                        <select className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none ">
                            <option value='espece'>Espece</option>
                            <option value="mvola">Mvola</option>
                            <option value="liquide">Liquide</option>
                        </select>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="montant">Montant</label>
                        <input type="text" id="montant"
                            placeholder="montant"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-evenly">
                        <div className="flex flex-col justify-between items-center">
                            <label htmlFor="paye">Payé</label>
                            <input type="checkbox" id="paye"
                                className=" bg-slate-300 size-4 bg-opacity-15 rounded outline-none " />
                        </div>
                        <div className="flex flex-col justify-between items-center">
                            <label htmlFor="nonPaye">Non payé</label>
                            <input type="checkbox" id="nonPaye"
                                className="size-4 bg-slate-300 bg-opacity-15 rounded outline-none " />
                        </div>
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg">
                        Pay Now
                    </button>
                </form>
            </div>
        </div>
    )
}
