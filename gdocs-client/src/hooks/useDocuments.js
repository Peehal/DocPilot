import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { api } from '@/lib/api';

export function useDocuments(scope = 'mine') {
  // orgId in the key so switching workspaces (personal <-> org) via the
  // OrganizationSwitcher actually triggers a fresh fetch instead of showing
  // whichever workspace's list happened to be cached from before the switch.
  const { orgId } = useAuth();
  return useQuery({
    queryKey: ['documents', scope, orgId],
    queryFn: async () => (await api.get('/documents', { params: { scope } })).data,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, templateId } = {}) =>
      (await api.post('/documents', { title, templateId })).data,
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

export function useRestoreDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await api.patch(`/documents/${id}/restore`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}

export function usePermanentlyDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => api.delete(`/documents/${id}/permanent`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}
