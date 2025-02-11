import {useState, useEffect, useMemo} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import useToast from "./(tantely)/hooks/useToast.jsx";
import {apiUrl} from "../../../services/api.js"

const CreatePaymentAfterOrder = ({  type, number, onCancel }) => {
    const { showSuccess, showError } = useToast();
    const [defaultValueTab, setDefaultValueTab] = useState([])
    const [defaultValueRoo, setDefaultValueRoo] = useState([])

    const [payload, setPayload] = useState({
        tableNumbers: [],
        roomNumbers: [],
        paymentMethod: "",
        status: "UNPAID",
        description: "",
    });

    const [data, setData] = useState({
        statuses: [],
        methods: [],
        tables: [],
        rooms: [],
    });

    const fetchData = async () => {
        try {
            const [ methodsRes, tablesRes, roomsRes, statusesRes] =
                await Promise.all([
                    fetch(apiUrl("/payments/method")),
                    fetch(apiUrl("/tables/all")),
                    fetch(apiUrl("/rooms")),
                    fetch(apiUrl("/payments/status")),
                ]);

            const resTables = await tablesRes.json();
            const resRooms =  await roomsRes.json()

            if (type === 'table'){
                const selectTables = (resTables || []).find(t => t.number === number) || null
                setDefaultValueTab(() => selectTables ? [selectTables] : [])
            }

            if (type === 'room'){
                const selectRoom = (resRooms || []).find(t => t.roomNumber === number) || null
                setDefaultValueRoo(() => selectRoom ? [selectRoom] : [])
            }

            setData({
                methods: await methodsRes.json(),
                tables: resTables,
                rooms: resRooms,
                statuses: await statusesRes.json(),
            });
        } catch (error) {
            console.error(error);
            showError("Erreur lors du chargement des données.");
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);


    const defaultValueTable = () => {
        if (type === 'table'){
            const selectTables = (data.tables || []).find(t => t.number === number) || null
            return selectTables ? [selectTables] : []
        }
        return []
    }


    const defaultValueRoom = () => {
        if (type === 'room'){
            const selectRooms = (data.rooms || []).find(r => r.roomNumber === number)
            return selectRooms ? [selectRooms] : []
        }
        return []
    }


    const handleChange = (field, value) => {
        setPayload((prev) => ({ ...prev, [field]: value }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(apiUrl("/payments"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la création du paiement.");
            }

            const result = await response.json();
            console.log("Paiement créé :", result);
            showSuccess("Paiement soumis avec succès !");
        } catch (error) {
            console.error(error);
            showError("Erreur lors de la soumission du paiement.");
        }
    };


    return (
        <div className="max-w-lg mx-auto p-4 shadow-md rounded">
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex flex-row gap-4 mb-4">
                    <div className="w-1/2">
                        <label htmlFor="tableNumbers" className="block text-gray-700">
                            Tables:
                        </label>
                        <Autocomplete
                            id="tableNumbers"
                            multiple
                            options={data.tables}
                            defaultValue={defaultValueTab}
                            getOptionLabel={(option) => `Table ${option.number}`}
                            onChange={(event, value) =>
                                    handleChange(
                                        "tableNumbers",
                                        value.map((table) => table.number)
                                    )
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Choisir des tables..."
                                />
                            )}
                            className="w-full"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="roomNumbers" className="block text-gray-700">
                            Chambres:
                        </label>
                        <Autocomplete
                            id="roomNumbers"
                            multiple
                            defaultValue={defaultValueRoo}
                            options={data.rooms}
                            getOptionLabel={(option) => `Chambre ${option.roomNumber}`}
                            onChange={(event, value) =>
                                handleChange(
                                    "roomNumbers",
                                    value.map((room) => room.roomNumber)
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Choisir des chambres..."
                                />
                            )}
                            className="w-full"
                        />
                    </div>
                </div>


                <div className="flex flex-row gap-2">
                    <div className="w-full">
                        <label htmlFor="paymentMethod" className="block text-gray-700">
                            Payment Method:
                        </label>
                        <Autocomplete
                            id="paymentMethod"
                            options={data.methods}
                            getOptionLabel={(option) => option.toLowerCase()}
                            onChange={(event, value) =>
                                handleChange(
                                    "paymentMethod",
                                    value ?? ""
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Choisir..."
                                />
                            )}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Description:</label>
                    <textarea
                        value={payload.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        rows="3"
                        maxLength={255}
                    />
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 rounded p-2 hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    >
                        Submit Payment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePaymentAfterOrder;
