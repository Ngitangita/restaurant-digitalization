import React, { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import dayjs from "dayjs";
import { MdInfoOutline } from "react-icons/md";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";

function MostSoldMenus() {
  const [mostSoldMenus, setMostSoldMenus] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();

  const fetchMostSoldMenus = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJson(apiUrl(`/most-sold-menus?date=${selectedDate}`));
      setMostSoldMenus(groupByDate(data));
    } catch (error) {
      showError("Erreur lors du chargement des menus : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMostSoldMenus();
  }, [selectedDate]);
  
  const groupByDate = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const dateKey = dayjs(selectedDate).format("DD/MM/YYYY");

      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          total: 0,
          menus: [],
        };
      }

      item.menus.forEach((menu) => {
        grouped[dateKey].menus.push(menu);
        grouped[dateKey].total += menu.price * menu.quantityMenuByName;
      });
    });

    return grouped;
  };

  const filterMenus = (menus) =>
    menus.filter((menu) =>
      menu.name.toLowerCase().includes(menuName.toLowerCase())
    );

  return (
    <div className="darkBody container mx-auto p-4 bg-white pb-10 pr-14 sm:px-6 md:px-8 lg:px-14 xl:px-20">
      <h1 className="text-2xl font-bold mb-4">Menus les plus vendus</h1>

      <div className="flex mb-4 gap-2">
        <input
          type="search"
          placeholder="Rechercher par nom du menu"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-60 outline-none"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Date</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Quantité</th>
              <th className="p-2">Prix unitaire</th>
              <th className="p-2">Total</th>
              <th className="p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && Object.keys(mostSoldMenus).length > 0 ? (
              Object.entries(mostSoldMenus).map(([dateLabel, group]) => {
                const filteredMenus = filterMenus(group.menus);

                return (
                  <React.Fragment key={dateLabel}>
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={6} className="text-left p-2">
                        {dateLabel} — Total : {group.total} Ar
                      </td>
                    </tr>

                    {filteredMenus.length > 0 ? (
                      filteredMenus.map((menu) => (
                        <tr key={menu.id} className="border-b text-center">
                          <td className="p-2">{dateLabel}</td>
                          <td className="p-2">{menu.name}</td>
                          <td className="p-2">{menu.quantityMenuByName}</td>
                          <td className="p-2">{menu.price} Ar</td>
                          <td className="p-2">
                            {menu.price * menu.quantityMenuByName} Ar
                          </td>
                          <td className="p-2">{menu.description || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-2 text-center text-gray-500">
                          Aucun menu ne correspond à la recherche
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  {isLoading ? (
                    "Chargement..."
                  ) : (
                    <div className="flex flex-col items-center">
                      <MdInfoOutline className="text-4xl text-gray-400 mb-2" />
                      Aucun menu trouvé pour cette date
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MostSoldMenus;
