import { create } from "zustand"
import { createBudget, fetchBudgets, deleteBudget, updateBudget } from "../api"


const useBudgetStore = create((set,get) => ({
  budgets:[],
  isLoading: false,
  error: null,

  // 목록가져오기
  getBudgets: async() => {
    set({isLoading: true, error: null});
    try{
      const {data} = await fetchBudgets();
      set({budgets: data, isLoading:false});
    } catch(error) {
      set({error, isLoading:false});
      console.error('예산 목록 로딩 실패', error);
    }
  },

  // 예산 생성
  addBudget: async(budgetData) => {
    set({isLoading: true, error: null});
    try{
      const {data: newData} = await createBudget(budgetData);
      set((state) => ({
        budgets: [...state.budgets, newData],
        isLoading: false
      }));
    } catch(error) {
      set({error, isLoading:false});
      console.error('예산 목록 생성 실패 ', error);
    }
  },

  // 예산 삭제
  deleteBudget: async(id) => {
    if(!window.confirm('정말로 이 예산 계획을 삭제하시겠어요??')) return;
    set({isLoading: true, error: null});
    try{
      await deleteBudget(id);
      set((state) => ({
        budgets: state.budgets.filter((budget) => budget._id !== id),
        isLoading:false
      }));
    } catch (error) {
      set({error, isLoading:false})
      console.error('예산 계획 삭제 실패', error);
    }
  },

  // 예산 수정
  updateBudget: async(id, updatedData) => {
    set({isLoading:true, error: null});
    try{
      const {data: updatedBudget} = await updateBudget(id, updatedData);
      set((state) => ({
        budgets: state.budgets.map((budget) => budget._id === id ? updatedBudget : budget),
        isLoading:false
      }));
    } catch (error) {
      set({error, isLoading: false});
      console.error('예산 수정 실패', error);
      // 에러 발생해도 원래 목록 다시 불러옴 -> UI 안정적으로 유지 위해
      get().getBudgets();
    }
  }
}));

export default useBudgetStore;