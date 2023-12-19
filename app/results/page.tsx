import { sql } from "@vercel/postgres";
import { Result, Results } from "./results";

export default async function ResultsPage() {
    const data = await sql`SELECT * FROM correlation ORDER BY actual`;
    return <Results results={data.rows as Result[]}/>;
}