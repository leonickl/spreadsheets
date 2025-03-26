import CellData from "./CellData";
import { useGlobalState } from "./hooks/useGlobalState";
import { between } from "./lib/data";
import { isEmail, isPhoneNumber, isURL } from "./lib/types";

export default function Cell({ y, x, cell }) {
    const {
        cursor,
        setCursor,
        secondaryCursor,
        setSecondaryCursor,
        inputRef,
        mouseIsDown,
        setMouseIsDown,
    } = useGlobalState();

    const focused = cursor && cursor.y == y && cursor.x == x;

    const secondaryFocused =
        secondaryCursor && secondaryCursor.y == y && secondaryCursor.x == x;

    const focusRange =
        secondaryCursor &&
        between(x, cursor.x, secondaryCursor.x) &&
        between(y, cursor.y, secondaryCursor.y);

    const classes = [
        "border border-opacity-20 border-white hover:bg-gray-700 relative truncate",
        secondaryFocused && "outline outline-red-600 outline-3 rounded",
        focused && "outline outline-blue-600 outline-3 rounded",
        focusRange && "bg-gray-800",
        cell.type === "special" && isEmail(cell.data) && "special type-mail",
        cell.type === "special" &&
            isPhoneNumber(cell.data) &&
            "special type-phone",
        cell.type === "special" && isURL(cell.data) && "special type-url",
        cell.type === "money" && "special type-money",
        cell.type === "percent" && "special type-percent",
        cell.type === "select" && "special type-select",
        cell.data?.[0] === "=" && "special type-formula",
    ];

    return (
        <td
            className={classes.filter((c) => c).join(" ")}
            onMouseDown={() => {
                setMouseIsDown(true);
                setSecondaryCursor({ y, x });
            }}
            onMouseEnter={() => mouseIsDown && setCursor({ y, x })}
            onMouseUp={() => {
                setMouseIsDown(false);

                setCursor({ y, x });

                console.log(cursor, secondaryCursor);

                if (x === secondaryCursor.x && y === secondaryCursor.y) {
                    setSecondaryCursor();
                }
            }}
            onDoubleClick={() => inputRef.current?.focus()}
        >
            <div className={`min-h-9 min-w-24 px-5 py-2 select-none`}>
                <CellData cell={cell} />
            </div>
        </td>
    );
}
