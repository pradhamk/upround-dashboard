import { createClient } from "@/utils/supabase/server";

export default async function Startups() {
    const client = await createClient();

    // Fetch startups where active is true
    const { data: startups, error } = await client
        .from("startups")
        .select("*")
        .eq("active", true);

    if (error) {
        return (
            <div className="relative pt-24 pl-16">
                <p className="text-red-500">Failed to load startups. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="relative pt-24 pl-16">
            <h1 className="text-5xl font-semibold mb-8">Current Startups:</h1>
            <ul className="space-y-4">
                {startups?.map((startup) => (
                    <li key={startup.id} className="text-xl">
                        {startup.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}