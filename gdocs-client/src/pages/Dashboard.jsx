import { UserButton } from '@clerk/clerk-react';
import { useApiAuthSync } from '@/hooks/useApiAuthSync';
import { useMe } from '@/hooks/useMe';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  useApiAuthSync();
  const { data, isLoading, isError, error } = useMe();

  return (
    <div className="mx-auto max-w-xl p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <UserButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GET /api/me (Clerk → Express pipe check)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading...</p>}
          {isError && (
            <p className="text-red-500">Error: {error?.message}</p>
          )}
          {data && (
            <pre className="text-sm bg-muted rounded-md p-4 overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
