import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-8">
            <div className="flex space-x-8">
                <a
                    href="https://vite.dev"
                    target="_blank"
                    className="transition hover:drop-shadow-[0_0_2em_#646cffaa]"
                >
                    <img
                        src={viteLogo}
                        className="h-24 p-6 transition"
                        alt="Vite logo"
                    />
                </a>
                <a
                    href="https://react.dev"
                    target="_blank"
                    className="transition hover:drop-shadow-[0_0_2em_#61dafbaa] animate-spin-slow"
                >
                    <img
                        src={reactLogo}
                        className="h-24 p-6"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1 className="text-5xl font-bold mt-6">Vite + React</h1>
            <div className="card bg-gray-800 p-8 rounded-lg mt-6">
                <button
                    onClick={() => setCount((count) => count + 1)}
                    className="px-6 py-3 bg-gray-700 border border-transparent text-lg font-medium rounded-lg transition hover:border-[#646cff] focus:outline focus:ring-4 focus:ring-blue-500"
                >
                    count is {count}
                </button>
                <p className="mt-4 text-gray-400">
                    Edit{" "}
                    <code className="bg-gray-700 px-1 py-0.5 rounded">
                        src/App.jsx
                    </code>{" "}
                    and save to test HMR
                </p>
            </div>
            <p className="text-gray-500 mt-6">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
}

export default App;
