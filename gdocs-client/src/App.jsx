import { useApiAuthSync } from '@/hooks/useApiAuthSync';
import { CollaborationProvider } from '@/lib/collaboration';
import AppRoutes from '@/routes/index.jsx';

export default function App() {
  useApiAuthSync();

  return (
    <CollaborationProvider>
      <AppRoutes />
    </CollaborationProvider>
  );
}
