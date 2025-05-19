import StartupsList from "@/components/StartupsList";

export default async function Startups() {
    return (
        <>
            <main className="w-full flex flex-col items-center justify-center">
                <StartupsList /> 
            </main>
        </>
    );
}