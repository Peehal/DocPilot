import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useDocument(id) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => (await api.get(`/documents/${id}`)).data,
    enabled: Boolean(id),
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
