import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changePassword,
  connectStore,
  disconnectStore,
  fetchAccountInfo,
  fetchConnectedStores,
  fetchMarketInfo,
  requestJoin,
  updateAccountInfo,
  updateMarketInfo,
  verifyCurrentPassword,
} from '@/apis/settings';

const STORES_KEY = ['settings', 'stores'] as const;

export const useAccountInfo = () =>
  useQuery({ queryKey: ['settings', 'account'], queryFn: fetchAccountInfo });

export const useUpdateAccountInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAccountInfo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', 'account'] }),
  });
};

export const useMarketInfo = () =>
  useQuery({ queryKey: ['settings', 'market'], queryFn: fetchMarketInfo });

export const useUpdateMarketInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMarketInfo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', 'market'] }),
  });
};

export const useConnectedStores = () =>
  useQuery({ queryKey: STORES_KEY, queryFn: fetchConnectedStores });

export const useConnectStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: connectStore,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STORES_KEY }),
  });
};

export const useDisconnectStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectStore,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STORES_KEY }),
  });
};

export const useVerifyCurrentPassword = () =>
  useMutation({ mutationFn: verifyCurrentPassword });

export const useChangePassword = () => useMutation({ mutationFn: changePassword });

export const useJoin = () => useMutation({ mutationFn: requestJoin });
