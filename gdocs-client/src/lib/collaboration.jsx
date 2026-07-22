import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react';
import { api } from './api';

// Single isolated integration point for real-time collaboration. Swapping to
// a self-hosted provider (e.g. Hocuspocus) later means only this file changes
// — the editor never talks to Liveblocks directly.

export function CollaborationProvider({ children }) {
  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const { data } = await api.post('/liveblocks-auth', { room });
        return data;
      }}
    >
      {children}
    </LiveblocksProvider>
  );
}

export function CollaborativeRoom({ roomId, fallback, children }) {
  return (
    <RoomProvider id={roomId} initialPresence={{}}>
      <ClientSideSuspense fallback={fallback}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}

export { useLiveblocksExtension } from '@liveblocks/react-tiptap';
export { useOthers, useSelf } from '@liveblocks/react';
