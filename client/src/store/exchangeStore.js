import { create } from "zustand";
import { fetchExchangeRate } from "../api";

const useExchangeStore = create((set) => ({
  rates: null,
  isLoading: false,
  error: null,

  getRates: async() => {
    set({isLoading: true, error: null});
    try{
      const { data } = await fetchExchangeRate();
      set({rates: data, isLoading: false});
      console.log('환율 정보 로딩 성공');
    } catch(error) {
      set({error, isLoading: false});
      console.error('환율 정보 로딩 실패', error);
    }
  },
}));

export default useExchangeStore;
