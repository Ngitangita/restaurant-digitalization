

export default function CreateJournal() {
    return (
        <div className="flex justify-center items-center">
            <div className="Journal flex justify-center text-gray-500 items-center flex-col bg-white rounded p-5 pt-5 pb-16">
                <div className="flex flex-col gap-4 items-center">
                    <div className="flex flex-row gap-3 items-center">
                        <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full" />
                        <div className='flex flex-col'>
                            <span className='text-2xl font-bold'>By Sooatel</span>
                            <span className='text-xs'>Ankasina Antananarivo <br /> Tel: 038 96 373 43</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold underline">Journal</h1>
                    <p>Pour enregistrer les entretiens et les sorties</p>
                </div>
                <form className="Journal flex flex-col justify-center gap-4 p-4 text-gray-700 rounded bg-white">
                    <div className="flex flex-row justify-between items-center">
                        <label htmlFor="date">Date :</label>
                        <input type="datetime-local" id="date"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor='libelle'>Libellé :</label>
                        <input type="text" id='libelle'
                            placeholder="libellé"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="recette">Recette :</label>
                        <input type="text" id="recette"
                            placeholder="recette"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="depense">Dépense :</label>
                        <input type="text" id="depense"
                            placeholder="dépense"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <div className="flex flex-row justify-between items-center gap-2">
                        <label htmlFor="montant">Montant :</label>
                        <input type="text" id="montant"
                            placeholder="montant"
                            className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg">
                        Envoyer
                    </button>
                </form>
            </div>
        </div>
    )
}
