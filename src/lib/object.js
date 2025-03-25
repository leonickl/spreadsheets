export default function obj(object) {
    return {
        map: (f) => Object.fromEntries(Object.entries(object).map(f)),
        export: (f) => Object.entries(object).map(f),
        filter: (f) => Object.fromEntries(Object.entries(object).filter(f)),
        without: (props) =>
            Object.fromEntries(
                Object.entries(object).filter(([key]) => !props.includes(key))
            ),
    };
}

export function isObject(object) {
    return (
        typeof object === "object" && JSON.stringify(object).charAt(0) === "{"
    );
}
