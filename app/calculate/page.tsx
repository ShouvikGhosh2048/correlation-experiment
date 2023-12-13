"use client";

import { useState } from "react";
import { correlation } from "../utils";
import { FaCheck, FaPen, FaTrash } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

interface PointProps {
    point: [number, number],
    setPoint: (point: [number, number]) => void,
    deletePoint: () => void,
}

function Point({ point, setPoint, deletePoint }: PointProps) {
    const [edit, setEdit] = useState<null | [string, string]>(null);

    if (edit) {
        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                setPoint([parseFloat(edit[0]), parseFloat(edit[1])]);
                setEdit(null);
            }} className="flex justify-between">
                <div className="flex gap-2">
                    <input type="number" min="-1" max="1" step="0.001" className="w-20"
                        value={edit[0]} onChange={(e) => { setEdit([e.target.value, edit[1]]) }} required />
                    <input type="number" min="-1" max="1" step="0.001" className="w-20"
                        value={edit[1]} onChange={(e) => { setEdit([edit[0], e.target.value]) }} required />
                </div>
                <div className="flex gap-5">
                    <button><FaCheck /></button>
                    <button type="button" onClick={() => { setEdit(null) }}><FaX /></button>
                </div>
            </form>
        );
    } else {
        return (
            <div className="flex justify-between">
                <div className="flex gap-2">
                <span className="w-20">{point[0]}</span>
                <span className="w-20">{point[1]}</span>
                </div>
                <div className="flex gap-5">
                    <button onClick={() => {
                        setEdit([point[0].toString(), point[1].toString()]);
                    }}><FaPen /></button>
                    <button onClick={() => {
                        deletePoint();
                    }}><FaTrash /></button>
                </div>
            </div>
        );
    }
}

export default function Calculate() {
    const [points, setPoints] = useState<[number, number][]>([]);

    return (
        <div className="w-fit mx-auto p-2 flex flex-col sm:flex-row gap-10">
            <div className="w-fit">
            <svg viewBox="-1 -1 2 2" width="300" height="300" className="border border-slate-500"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const point = [
                        Math.round(1000 * (e.clientX - rect.x - 150) / 150) / 1000,
                        Math.round(-1000 * (e.clientY - rect.y - 150) / 150) / 1000
                    ] as [number, number];
                    setPoints([...points, point]);
                }}>
                {points.map((point, i) => <circle key={i} cx={point[0]} cy={-point[1]} r="0.025" />)}
                {points.length === 0 &&
                    <text fontSize={0.2} x="-0.54" y="0" fill="black" fontFamily="monospace" className="select-none">Click here</text>}
            </svg>
            <div className="py-2 flex justify-between items-center">
                {points.length <= 1 && <span></span>}
                {points.length > 1 && <span>Correlation = {Math.round(correlation(points) * 1000) / 1000}</span>}
                <button onClick={() => { setPoints([]) }} className="bg-gray-200 p-1 rounded">Reset</button>
            </div>
            </div>
            <div className="w-60">
                <p className="text-xl">Points</p>
                <div className="mt-3 space-y-5">
                    {points.map((point, i) =>
                        <Point key={i} point={point}
                            setPoint={(point) => { setPoints([...points.slice(0, i), point, ...points.slice(i+1)]) }}
                            deletePoint={() => { setPoints([...points.slice(0, i), ...points.slice(i+1)]) }} />)}
                </div>
            </div>
        </div>
    );
}