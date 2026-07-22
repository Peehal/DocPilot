import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useComments(documentId) {
  return useQuery({
    queryKey: ['comments', documentId],
    queryFn: async () => (await api.get(`/documents/${documentId}/comments`)).data,
    enabled: Boolean(documentId),
  });
}

export function useCreateComment(documentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) =>
      (await api.post(`/documents/${documentId}/comments`, payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', documentId] });
    },
  });
}

export function useUpdateComment(documentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, ...updates }) =>
      (await api.patch(`/documents/${documentId}/comments/${commentId}`, updates)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', documentId] });
    },
  });
}

export function useDeleteComment(documentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId) => api.delete(`/documents/${documentId}/comments/${commentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', documentId] });
    },
  });
}

export function useUserSearch(query) {
  return useQuery({
    queryKey: ['users-search', query],
    queryFn: async () => (await api.get('/users/search', { params: { q: query } })).data,
    enabled: query.trim().length > 0,
  });
}
