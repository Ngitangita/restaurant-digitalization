import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditUnitPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({
        id: 0,
        name: "",
        abbreviation: ""
    });

    const onChangeData = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8086/units/${id}`);
                const unitData = await res.json();
                setData(unitData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8086/units/put", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                navigate("/units");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full h-full bg-zinc-950 flex justify-center items-center py-5">
            <form
                onSubmit={onSubmit}
                className="w-2/5 h-auto p-4 text-white flex justify-around flex-col bg-zinc-900 gap-3 font-bold"
            >
                <h1 className="text-center text-3xl">Modifier l'unité</h1>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-slate-500">
                        Nom
                    </label>
                    <input type="text" id='name' name='name'
                        placeholder="Nom de l'unité"
                        className="p-2 outline-none bg-zinc-950 border border-slate-500"
                        onChange={onChangeData}
                        value={data.name}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="abbreviation" className="text-slate-500">
                        Abréviation
                    </label>
                    <input type="text" id='abbreviation' name='abbreviation'
                        placeholder="Abréviation de l'unité"
                        className="p-2 outline-none bg-zinc-950 border border-slate-500"
                        onChange={onChangeData}
                        value={data.abbreviation}
                    />
                </div>
                <button className="w-32 bg-orange-300 relative left-1/3 p-2 hover:scale-110 transition">Envoyez</button>
            </form>
        </div>
    );
};

export default EditUnitPage;
