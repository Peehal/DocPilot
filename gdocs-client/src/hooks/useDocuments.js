import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { api } from '@/lib/api';

export function useDocuments() {
  // orgId in the key so switching workspaces (personal <-> org) via the
  // OrganizationSwitcher actually triggers a fresh fetch instead of showing
  // whichever workspace's list happened to be cached from before the switch.
  const { orgId } = useAuth();
  return useQuery({
    queryKey: ['documents', orgId],
    queryFn: async () => (await api.get('/documents')).data,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title) => (await api.post('/documents', { title })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => api.delete(`/documents/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}
