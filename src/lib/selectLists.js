export const selectLists = {
    people: ["Anton", "Berta", "Caesar", "Dora"],
    animals: ["Cat", "Dog", "Giraffe", "Monkey", "Cow", "Ox"],
};

export const colors = [
    "bg-yellow-200 text-yellow-900",
    "bg-green-200 text-green-900",
    "bg-pink-200 text-pink-900",
    "bg-red-200 text-red-900",
    "bg-yellow-300 text-yellow-900",
    "bg-green-300 text-green-900",
    "bg-pink-300 text-pink-900",
    "bg-blue-300 text-blue-900",
];

export const gray = "bg-gray-300 text-gray-900";

export function coloredItems(listName, lists = selectLists) {
    const items = lists[listName];
    const coloredItems = [];

    for (let i = 0; i < items?.length; i++) {
        coloredItems.push([items[i], colors[i % colors.length]]);
    }

    return Object.fromEntries(coloredItems);
}
