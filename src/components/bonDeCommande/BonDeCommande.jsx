import ListeDesMenu from "./ListeDesMenu";


export default function BonDeCommande() {


    const Foods = [
        {
            id: 1,
            name: "NOS PIZZAS",
            menus: [
                { id: 1, name: "Pizza Margherita", prix: "22 000 AR" },
                { id: 2, name: "Pizza Cremiera", prix: "22 000 AR" },
                { id: 3, name: "Pizza 4 Fromage", prix: "25 000 AR" },
            ]
        },
        {
            id: 2,
            name: "NOS SNACKS",
            menus: [
                { id: 1, name: "Sandwich", prix: "12 000 AR" },
                { id: 2, name: "Frites", prix: "8 000 AR" },
            ]
        }
    ];

    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center items-center flex-col bg-white rounded text-gray-500">
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
                <form className="w-[800px] flex flex-col items-center justify-around gap-2 p-4 text-gray-700 rounded bg-white">
                    <div className="w-[600px] flex flex-row justify-around items-center p-4  flex-wrap">
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
                    <ListeDesMenu Foods={Foods} />
                    <div className=" w-full flex  gap-4 items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                            Decline
                        </button>
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            I accept
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
