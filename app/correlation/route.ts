import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { rows } = await sql`SELECT * FROM correlation ORDER BY actual`;
    return NextResponse.json(rows);
}

export async function POST(req: Request) {
    try {
        const { actual, guess, guessNumber } = await req.json();
        if (typeof actual != "number" || typeof guess != "number" || typeof guessNumber != "number") {
            throw 'Expected numbers.';
        }
        
        await sql`INSERT INTO correlation(actual, guess, guessNumber) VALUES (${actual}, ${guess}, ${guessNumber});`;
        revalidatePath('/results');
        return NextResponse.json('Added', { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json('Error', { status: 500 });
    }
}