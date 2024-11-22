import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

type Note = {
    frequency: number;
    start: number;
    endtime: number;
}

export default function Tauri() {
    const [notesData, setNotesData] = useState<Note[]>([]);

    useEffect(() => {
        invoke("get_notes_data").then((notes) => {
            setNotesData(notes as Note[]);
        });
    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-bold text-gray-800">Hello from Tauri!</h1>
            <p className="text-gray-600">This is a React app bundled by Vite and running in a Tauri window.</p>
        </div>
        </div>
    );
}