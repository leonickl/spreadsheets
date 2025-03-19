export default function CellData({ cell }) {
    return (
        <span
            className={`${cell.bold && "font-bold"}
                ${cell.underline && "underline"}
                ${cell.italic && "italic"}`}
        >
            {cell.data}
        </span>
    );
}
