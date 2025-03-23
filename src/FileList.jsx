import { useEffect, useState } from "react";
import { fetchFileList } from "./lib/fetchFile";
import { useGlobalState } from "./hooks/useGlobalState";

export default function FileList() {
    const [fileList, setFileList] = useState();

    const { openTable, setShowFileList } = useGlobalState();

    useEffect(() => {
        fetchFileList().then(setFileList);
    }, []);

    if (!fileList) {
        return <p>loading...</p>;
    }

    console.log(fileList);

    return (
        <div className="fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center z-20">
            <div
                className="fixed h-screen w-screen bg-gray-700 opacity-70 cursor-pointer"
                onClick={() => setShowFileList(false)}
            ></div>

            <div className="flex-col gap-2 max-h-[70%] bg-gray-800 border border-gray-700 shadow-md p-5 rounded overflow-scroll z-30">
                <div className="m-5">
                    {fileList.map(([uuid, filename, cells]) => (
                        <div
                            className="flex flex-row gap-5 hover:underline cursor-pointer"
                            onClick={() => openTable(uuid)}
                        >
                            {uuid === filename + ".json" ? (
                                <div className="text-gray-500">
                                    {filename.substr(0, 10)}
                                </div>
                            ) : (
                                <div>{filename}</div>
                            )}
                            <div>{cells}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
