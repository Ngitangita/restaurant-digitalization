export default function CreateReservation() {
    return (
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center flex-col bg-white rounded p-5">
          <div className="flex flex-col gap-4 items-center">
            <div className="flex flex-row gap-3 items-center">
              <img src="../public/UTOPIA-B.png" alt="UTOPIA-B" className="w-16 h-16 rounded-full" />
              <div className='flex flex-col'>
                <span className='text-2xl font-bold'>Par Sooatel</span>
                <span className='text-xs'>Ankasina Antananarivo <br /> Tel: 038 96 373 43</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold underline">Création de la réservation</h1>
          </div>
          <form className="flex flex-col justify-center gap-4 p-4 text-gray-700 rounded bg-white">
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="date">Date :</label>
              <input type="datetime-local" id="date"
                className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="table">N° de table :</label>
              <input type="number" id="table"
                placeholder="numéro de table"
                className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="chambre">Chambre :</label>
              <input type="number" id="chambre"
                placeholder="numéro de chambre"
                className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
            </div>
            <div className="flex flex-row justify-between items-center">
              <label htmlFor="designation">Désignation :</label>
              <input type="text" id="designation"
                placeholder="désignations"
                className="w-72 pl-4 pr-2 py-1 bg-slate-300 size-10 bg-opacity-15 rounded outline-none " />
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg">
              Réserver
            </button>
          </form>
        </div>
      </div>
    )
  }
  