import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useDocument(id) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => (await api.get(`/documents/${id}`)).data,
    enabled: Boolean(id),
    // The editor only reads its initial content once at mount, so a stale
    // cached copy served here would silently show outdated content forever.
    // gcTime 0 forces a real fetch (and a loading state) on every visit.
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useRenameDocument(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title) => (await api.patch(`/documents/${id}`, { title })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Fire-and-forget: skips invalidating the document query so a debounced
// autosave doesn't refetch mid-typing and fight with the editor's own state.
export function useUpdateDocument(id) {
  return useMutation({
    mutationFn: async (updates) => (await api.patch(`/documents/${id}`, updates)).data,
  });
}
