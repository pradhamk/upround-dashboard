import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ADMIN_EMAIL } from "@/utils/utils";
import Link from "next/link";

export default function BadAuthPage() {
    return (
        <main className="w-full flex flex-col items-center justify-center px-4 text-gray-800">
            <Card className="mt-20">
                <CardHeader className="flex flex-col items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
                    <p className="text-sm text-gray-600">
                        We encountered a problem verifying your authentication. This may be due to:
                    </p>
                </CardHeader>
                <CardContent className="pt-0">
                    <ul className="text-left text-sm text-gray-700 list-disc list-inside space-y-1 mb-4">
                        <li>Session timeout</li>
                        <li>Invalid or expired token</li>
                        <li>Network or server-side issue</li>
                        <li>Improper login attempt</li>
                    </ul>
                    <p className="text-sm text-gray-600 mb-3">
                        Please try one of the following:
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button variant="default" asChild>
                            <Link href='/api/redirect_oauth'>Retry</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`mailto:${ADMIN_EMAIL}`}>Contact Admin</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
