

export default function AddFoodStock() {
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
            <h1 className="text-2xl font-bold underline">ajouter la nouriture</h1>
          </div>
          <form className="flex flex-col justify-center gap-4 p-4 text-gray-700 rounded bg-white">
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="name">Nom:</label>
              <input type="text" id="name"
                placeholder="drink name"
                className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="enter">Entrées</label>
              <input type="text" id="enter"
                placeholder="enter"
                className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="stockFinal">Stock Final</label>
              <input type="text" id="stockFinal"
                placeholder="Stock Final"
                className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
            </div>
          </form>
        </div>
      </div>
    )
  }
  