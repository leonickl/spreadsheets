import { gray } from "./lib/selectLists";

export default function SelectItem({ item, color, active, toggleActive }) {
    return (
        <div
            className={`px-2 py-1 rounded cursor-pointer ${
                active ? color : gray
            }`}
            onClick={toggleActive}
        >
            {item}
        </div>
    );
}
