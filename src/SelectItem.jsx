export default function SelectItem({ item, color, active, toggleActive }) {
    const gray = "bg-gray-300 text-gray-900";

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
