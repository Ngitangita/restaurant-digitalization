

export default function BonDeCommande() {
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
                    <h1 className="text-2xl font-bold underline">Bon de dommande</h1>
                </div>
                <form className="w-[600px] flex flex-row flex-wrap justify-around gap-2 p-4 text-gray-700 rounded bg-white">
                    <div className="flex flex-col justify-between items-center">
                        <label htmlFor="date">Date:</label>
                        <input type="datetime-local" id="date"
                            className="w-48 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-col justify-between items-center">
                        <label htmlFor="table">N° de table:</label>
                        <input type="number" id="table"
                            placeholder="n° de table"
                            className="w-40 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-col justify-between items-center">
                        <label htmlFor="chambre">Chambre:</label>
                        <input type="number" id="chambre"
                            placeholder="n° du chambre"
                            className="w-40 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    {/* <div className="flex flex-col justify-between items-center">
                        <label htmlFor="designation">Désignation:</label>
                        <input type="text" id="designation"
                            placeholder="les désignations"
                            className="w-52 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div> */}

                    <div className="w-[500px] flex flex-col justify-between items-center">
                        <label htmlFor="designation">Désignation:</label>
                        <textarea name="designation" id="designation"
                            placeholder="les déesignations"
                            className="w-[500px] h-32 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none ">
                        </textarea>
                    </div>
                    {/* <div className="flex flex-col justify-between items-center gap-2">
                        <label htmlFor="designation">Commande prise par:</label>
                        <select className="w-52 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none ">
                            <option value='aucune'>aucune</option>
                            <option value="fitahina">Fitahina</option>
                            <option value="elise">Elisé</option>
                            <option value="tantely">Tantely</option>
                        </select>
                    </div> */}
                </form>
            </div>
        </div>
    )
}
