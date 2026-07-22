import { useMe } from '@/hooks/useMe';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Profile() {
  const { data, isLoading, isError, error } = useMe();

  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-xl p-8">
        <Card>
          <CardHeader>
            <CardTitle>GET /api/me (Clerk → Express pipe check)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Loading...</p>}
            {isError && <p className="text-red-500">Error: {error?.message}</p>}
            {data && (
              <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
