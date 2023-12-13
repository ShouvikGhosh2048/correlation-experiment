"use client";

import { FormEvent, useEffect, useState } from "react";
import { correlation, randomPoints } from "../utils";
import { PointsSVG } from "../PointsSVG";

function round(x: number) {
    return Math.round(x * 1000) / 1000;
}

export default function Guess() {
    const [points, setPoints] = useState<[number, number][]>([]);
    const [guess, setGuess] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [guessNumber, setGuessNumber] = useState(1);

    useEffect(() => {
        setPoints(randomPoints());
    }, []);

    function onGuess(e: FormEvent) {
        e.preventDefault();
        fetch('/correlation', {
            method: 'POST',
            headers: {
                "ContentType": "application/json"
            },
            body: JSON.stringify({
                guess: parseFloat(guess),
                actual: round(correlation(points)),
                guessNumber,
            }),
        });
        setShowAnswer(true);
    }

    function onNewPoints() {
        setPoints(randomPoints());
        setGuess('');
        setShowAnswer(false);
        setGuessNumber(guessNumber + 1);
    }

    return (
        <main className="w-fit mx-auto p-3 flex flex-col gap-3 items-center">
            <PointsSVG points={points} />
            {
                !showAnswer && (
                    <form className="flex justify-between w-full" onSubmit={onGuess}>
                        <input className="border border-slate-500 rounded p-1"
                            placeholder='Correlation' type="number"
                            min='-1' max='1' step="0.001"
                            value={guess} onChange={(e) => {setGuess(e.target.value)}} required/>
                        <input className="bg-slate-900 text-white p-1 rounded" type="submit" value="Guess"/>
                    </form>
                )
            }
            {
                showAnswer && (
                    <div className="w-full space-y-2">
                        <p>Guess: {guess}</p>
                        <p>Actual: {round(correlation(points))}</p>
                        <button className="bg-slate-900 text-white p-1 rounded" onClick={onNewPoints}>New points</button>
                    </div>
                )
            }
        </main>
    );
}
