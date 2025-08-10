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

const schema = z
  .object({
    customerId: z.union([z.string(), z.number()]).optional(),
    roomId: z.union([z.string(), z.number()]).nullable().optional(),
    tableId: z.union([z.string(), z.number()]).nullable().optional(),
  })
  .refine((data) => data.roomId || data.tableId, {
    message: "Il faut choisir soit une table soit une chambre.",
    path: ["roomId"],
  });

function CreateMenuOrder({ onClose, onOrderCreated }) {
  const [menuRequest, setMenuRequest] = useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [menuError, setMenuError] = useState("");
  const [customers, setCustomers] = useState([]);
  const [tables, setTables] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { showError, showSuccess } = useToast();
  const [menus, setMenus] = useState([]);

  const handleConfirm = async (data) => {
    if (menuRequest.length === 0) {
      setMenuError("Veuillez ajouter au moins un élément de menu.");
      return;
    }

    const payload = {
      customerId: data.customerId ? Number(data.customerId) : null,
      roomNumber: data.roomId ? Number(data.roomId) : null,
      tableNumber: data.tableId ? Number(data.tableId) : null,
      menuItems: menuRequest,
    };

    try {
      const response = await fetch(apiUrl("/menu-orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
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
      onOrderCreated(data);
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
      const urls = [
        `${apiUrl("/customers/all")}`,
        `${apiUrl("/tables/all")}`,
        `${apiUrl("/rooms")}`,
        `${apiUrl("/menus/all")}`,
      ];

      try {
        const [customersData, tablesData, roomsData, menusData] =
          await Promise.all(urls.map((url) => fetchJson(url)));
        setCustomers(customersData || []);
        setTables(tablesData || []);
        setRooms(roomsData || []);
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
      {/* Section sélection client, chambre, table */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Client */}
        <Controller
          name="customerId"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label
                className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="customerId"
              >
                Client
              </label>
              <Autocomplete
                options={customers}
                getOptionKey={(option, index) =>
                  option?.id ?? `default-key-${index}`
                }
                getOptionLabel={(option) => option?.name || "Inconnu"}
                onChange={(event, value) => field.onChange(value?.id || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionnez un client"
                    variant="outlined"
                    error={!!errors.customerId}
                  />
                )}
              />
            </div>
          )}
        />

        {/* Chambre */}
        <Controller
          name="roomId"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label
                className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="roomId"
              >
                Chambre
              </label>
              <Autocomplete
                options={rooms}
                getOptionKey={(option, index) =>
                  option?.id ?? `default-key-${index}`
                }
                getOptionLabel={(option) =>
                  option?.number?.toString() || "Inconnu"
                }
                onChange={(event, value) =>
                  field.onChange(value?.number || null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionnez une chambre"
                    variant="outlined"
                    error={!!errors.roomId}
                  />
                )}
              />
            </div>
          )}
        />

        {/* Table */}
        <Controller
          name="tableId"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <label
                className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="tableId"
              >
                Table
              </label>
              <Autocomplete
                options={tables}
                getOptionKey={(option, index) =>
                  option?.id ?? `default-key-${index}`
                }
                getOptionLabel={(option) =>
                  option?.number?.toString() || "Inconnu"
                }
                onChange={(event, value) =>
                  field.onChange(value?.number || null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sélectionnez une table"
                    variant="outlined"
                    error={!!errors.tableId}
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

export default CreateMenuOrder;
