export default function CellData({ cell }) {
    if (cell.bold) {
        return <b>{cell.data}</b>;
    }

    return <span>{cell.data}</span>;
}
