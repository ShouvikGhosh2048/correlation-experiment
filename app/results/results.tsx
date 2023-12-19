"use client";

import { Bar, Scatter } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, PointElement } from "chart.js";
import { useState } from "react";
import Link from "next/link";

ChartJS.register(LinearScale, PointElement, CategoryScale, BarElement);

export interface Result {
    actual: number,
    guess: number,
    guessnumber: number,
}

function Summary({ results }: { results: Result[] }) {
    const numberOfGuesses = results.length;
    if (numberOfGuesses === 0) {
        return <p>No points</p>;
    }

    const sortedAbsDiff = results.map(result => Math.abs(result.guess - result.actual)).sort((a, b) => a - b);

    const sortedAbsDiffBins: { label: string, count: number }[] = [];
    for (let i = 0; i < 10; i++) {
        sortedAbsDiffBins.push({
            label: `${i / 5}-${(i + 1) / 5}`,
            count: 0
        });
    }
    sortedAbsDiff.forEach(difference => {
        let index = Math.floor(difference * 5);
        // If difference is 2.
        if (index >= 10) {
            index = 9;
        }
        sortedAbsDiffBins[index].count += 1;
    });

    const meanAbsDiff = sortedAbsDiff.reduce((total, diff) => total + diff, 0) / numberOfGuesses;
    const medianAbsDiff =
        (numberOfGuesses % 2 == 0)
            ? (sortedAbsDiff[Math.floor(numberOfGuesses / 2) - 1] + sortedAbsDiff[Math.floor(numberOfGuesses / 2)]) / 2
            : sortedAbsDiff[Math.floor(numberOfGuesses / 2)];

    return (
        <div className="space-y-2">
            <p>Count: {numberOfGuesses}</p>
            <div className="w-80 h-80">
                <Scatter
                    data={{
                        datasets: [{
                            label: 'Guesses',
                            data: results.map(result => ({ x: result.actual, y: result.guess })),
                            backgroundColor: 'black',
                        }]
                    }}
                    options={{
                        aspectRatio: 1,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Actual'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Guess'
                                }
                            }
                        }
                    }}
                />
            </div>
            <p>Distribution of |guess - actual|</p>
            <div className="w-80 h-80">
                <Bar
                    data={{
                        labels: sortedAbsDiffBins.map(bin => bin.label),
                        datasets: [{
                            label: '|guess - actual|',
                            data: sortedAbsDiffBins.map(bin => bin.count),
                            backgroundColor: 'gray'
                        }]
                    }}
                    options={{
                        aspectRatio: 1,
                    }}
                />
            </div>
            <p>Mean |guess - actual|: {Math.round(1000 * meanAbsDiff) / 1000}</p>
            <p>Median |guess - actual|: {Math.round(1000 * medianAbsDiff) / 1000}</p>
        </div>
    );
}

export function ResultsForGuessNumber({
    results
}: {
    results: Result[]
}) {
    const [guessNumber, setGuessNumber] = useState(1);
    const maxGuessNumber = results.reduce((max, result) => Math.max(result.guessnumber, max), 1);

    return (
        <div>
            <h2 className="text-xl">Results for guess number:</h2>
            <div className="flex justify-between">
                <span>Guess number</span>
                <select value={guessNumber} onChange={(e) => {
                    setGuessNumber(parseInt(e.target.value));
                }} className="p-1">
                    {new Array(maxGuessNumber)
                        .fill(0)
                        .map((_, i) => <option className="font-sans" key={i + 1} value={i + 1}>{i + 1}</option>)}
                </select>
            </div>
            <Summary results={results.filter(result => result.guessnumber === guessNumber)} />
        </div>
    );
}

export function Results({
    results
}: {
    results: Result[]
}) {
    const maxGuessNumber = results.reduce((max, result) => Math.max(result.guessnumber, max), 1);
    const guessNumberBins: { label: string, count: number }[] = [];
    for (let i = 1; i <= maxGuessNumber; i++) {
        guessNumberBins.push({
            label: `${i}`,
            count: 0,
        });
    }
    results.forEach(({ guessnumber }) => {
        guessNumberBins[guessnumber - 1].count += 1;
    });

    return (
        <div className="p-3 space-y-5 mx-auto w-fit">
            <h1 className="text-3xl">Results</h1>
            <p>API endpoint for all results: <Link href="/correlation" className="underline">/correlation</Link></p>
            <h2 className="text-xl">Guesses:</h2>
            <Summary results={results} />
            <h2 className="text-xl">Distribution of guess number:</h2>
            <p>Max guess number: {maxGuessNumber}</p>
            <div className="w-80 h-80">
                <Bar
                    data={{
                        labels: guessNumberBins.map(bin => bin.label),
                        datasets: [{
                            label: 'Guess numbers',
                            data: guessNumberBins.map(bin => bin.count),
                            backgroundColor: 'gray',
                        }]
                    }}
                    options={{
                        aspectRatio: 1
                    }}
                />
            </div>
            <ResultsForGuessNumber results={results} />
        </div>
    );
}