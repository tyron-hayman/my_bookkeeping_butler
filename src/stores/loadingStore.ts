import { create } from 'zustand'

interface LoadingState {
  loadingState: boolean;
  setLoading: () => void;
  setLoadingDone: () => void;
}

const loadingStore = create<LoadingState>((set) => ({
  loadingState: true,
  setLoading: () => set(() => ({ loadingState: true })),
  setLoadingDone: () => set(() => ({ loadingState: false })),
}))

export default loadingStore;