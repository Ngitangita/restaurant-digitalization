import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../../services/api";
import MenuItems from "./MenuItems";
import { MdDelete } from "react-icons/md";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import useToast from "./(tantely)/hooks/useToast";
import dayjs from "dayjs";
import "dayjs/locale/fr";


const schema = z.object({
  orderId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.union([z.string(), z.number()])
  ),
});
dayjs.locale("fr");

function ExisteOrder({ onClose, onOrderCreated }) {
  const [menuRequest, setMenuRequest] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [menuError, setMenuError] = useState("");
  const [orders, setOrders] = useState([]);
  const { showError, showSuccess } = useToast();
  const [menus, setMenus] = useState([]);

  const handleConfirm = async (data) => {
    if (menuRequest.length === 0) {
      setMenuError("Veuillez ajouter au moins un élément de menu.");
      return;
    }
    const orderId = data.orderId ? Number(data.orderId) : null;
    try {
      const response = await fetch(
        apiUrl(`/menu-orders/${orderId}/order-lines`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menuRequest),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        const ingredientsList = data.message
          ? Array.from(
              new Set(
                data.message.split(",").map((item) => item.trim().toLowerCase())
              )
            ).map((item) => item.charAt(0).toUpperCase() + item.slice(1))
          : [];

        const formattedMessage =
          ingredientsList.length > 0
            ? `Les ingrédients suivants sont insuffisants :\n• ${ingredientsList.join(
                "\n• "
              )}`
            : `Erreur : ${response.statusText}`;

        setMenuError(formattedMessage);
        showError(formattedMessage);
        throw new Error(formattedMessage);
      }

      showSuccess("Commande créée avec succès !");
      onOrderCreated();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la soumission :", error.message);
    }
  };

  const handleSave = useCallback((data) => {
    setMenuRequest((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.menuId === data.menuId
      );
      if (existingItemIndex !== -1) {
        const updatedMenuRequest = [...prev];
        updatedMenuRequest[existingItemIndex].quantity += data.quantity;
        return updatedMenuRequest;
      } else {
        return [...prev, data];
      }
    });
  }, []);

  const removeItem = (menuId) => {
    setMenuRequest(menuRequest.filter((item) => item.menuId !== menuId));
  };

  useEffect(() => {
    const fetchData = async () => {
      const urls = [`${apiUrl("/menu-orders")}`, `${apiUrl("/menus/all")}`];

      try {
        const [ordersData, menusData] = await Promise.all(
          urls.map((url) => fetchJson(url))
        );

        setOrders(ordersData || []);
        setMenus(menusData || []);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  const handleCancel = () => {
    setMenuRequest([]);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(handleConfirm)}
      className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md max-w-4xl mx-auto"
    >
      <div>
        <Controller
          name="orderId"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label
                className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="orderId"
              >
                Choisir une commande
              </label>
              <Autocomplete
                options={[...orders].sort(
                  (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                )}
                getOptionLabel={(option) =>
                  option?.roomNumber
                    ? `Chambre n° ${option.roomNumber} --- dt: ${dayjs(
                        option.orderDate
                      ).format("DD-MMM-YYYY HH:mm:ss")}`
                    : `Table n° ${option.tableNumber} --- dt: ${dayjs(
                        option.orderDate
                      ).format("DD-MMM-YYYY HH:mm:ss")}`
                }
                onChange={(_, selected) =>
                  field.onChange(selected?.orderId || "")
                }
                renderInput={(params) => (
                  <TextField
                    label="Sélectionnez une commande"
                    variant="outlined"
                    error={!!errors.orderId}
                    {...params}
                    helperText={errors.orderId?.message}
                  />
                )}
              />
            </div>
          )}
        />
      </div>

      <div>
        <MenuItems onSave={handleSave} />
        {menuError && <p className="text-red-500 text-sm mt-2">{menuError}</p>}

        {menuRequest.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              Articles sélectionnés :
            </h2>
            <ul className="mt-2 border rounded px-4 py-2 max-h-[140px] overflow-y-auto scrollbar-custom bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
              {menuRequest.map((item, index) => {
                const menu = menus.find((m) => m.id === item.menuId);
                return (
                  <li
                    key={index}
                    className="flex items-center justify-between border-b last:border-none py-1"
                  >
                    <span>
                      {menu ? menu.name : "Menu inconnu"} — Quantité :{" "}
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.menuId)}
                      className="bg-red-500 text-white rounded p-1 hover:bg-red-600"
                    >
                      <MdDelete />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-200 text-gray-800 rounded px-4 py-2 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Confirmer
        </button>
      </div>
    </form>
  );
}

export default ExisteOrder;
