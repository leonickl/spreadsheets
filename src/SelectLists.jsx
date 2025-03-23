import { useState } from "react";
import { useGlobalState } from "./hooks/useGlobalState";
import { PlusCircleFill, XCircleFill } from "react-bootstrap-icons";

export default function SelectLists() {
    const { setShowSelectLists, selectLists, setSelectLists } =
        useGlobalState();

    const [name, setName] = useState();
    const [items, setItems] = useState([]);

    function addItem() {
        setSelectLists((elems) => ({ ...elems, [name]: items }));

        setName("");
        setItems([]);
    }

    function removeItem(name) {
        setSelectLists((elems) =>
            Object.fromEntries(
                Object.entries(elems).filter(([n]) => n !== name)
            )
        );
    }

    return (
        <div className="fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center z-20">
            <div
                className="fixed h-screen w-screen bg-gray-700 opacity-70 cursor-pointer"
                onClick={() => setShowSelectLists(false)}
            ></div>

            <div className="flex-col gap-2 max-h-[70%] bg-gray-800 border border-gray-700 shadow-md p-5 rounded overflow-scroll z-30">
                <div className="m-5 flex flex-col gap-10">
                    {Object.entries(selectLists ?? {}).map(([name, items]) => (
                        <div className="flex flex-row gap-5" key={name}>
                            <input
                                value={name}
                                readOnly
                                className="bg-gray-800 w-28 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                            />

                            <input
                                value={items.join(", ")}
                                readOnly
                                className="bg-gray-800 w-80 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                            />

                            <button
                                onClick={() => removeItem(name)}
                                className="bg-gray-800 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                            >
                                <XCircleFill width={16} />
                            </button>
                        </div>
                    ))}

                    <div className="flex flex-row gap-5">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-800 w-28 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                        />

                        <input
                            value={items.join(", ")}
                            onChange={(e) =>
                                setItems(
                                    e.target.value
                                        .split(",")
                                        .map((item) => item.trim())
                                )
                            }
                            className="bg-gray-800 w-80 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                        />

                        <button
                            onClick={addItem}
                            className="bg-gray-800 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                        >
                            <PlusCircleFill width={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
