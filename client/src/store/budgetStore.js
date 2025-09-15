import { create } from "zustand"
import { createBudget, fetchBudgets, deleteBudget as apiDeleteBudget, updateBudget as apiUpdateBudget, fetchBudgetById, addExpense as apiAddExpense, deleteExpense as apiDeleteExpense, updateExpense as apiUpdateExpense } from "../api"
import toast from "react-hot-toast"


const useBudgetStore = create((set,get) => ({
  budgets:[],
  selectedBudget: null,
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
      toast.error('예산 목록을 불러오는 데 실패했어요...');
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
      toast.success('새로운 예산이 추가되었어요!')
    } catch(error) {
      set({error, isLoading:false});
      toast.error('예산을 추가하는 데 실패했어요.');
    }
  },

  // 예산 삭제
  deleteBudget: async(id) => {
    if(!window.confirm('정말로 이 예산 계획을 삭제하시겠어요??')) return;
    set({isLoading: true, error: null});
    try{
      await apiDeleteBudget(id);
      set((state) => ({
        budgets: state.budgets.filter((budget) => budget._id !== id),
        isLoading:false
      }));
      toast.success('예산이 삭제되었어요.');
    } catch (error) {
      set({error, isLoading:false})
      toast.error('예산 삭제에 실패했어요.');
    }
  },

  // 예산 수정
  updateBudget: async(id, updatedData) => {
    set({isLoading:true, error: null});
    try{
      const {data: updatedBudget} = await apiUpdateBudget(id, updatedData);
      set((state) => ({
        budgets: state.budgets.map((budget) => budget._id === id ? updatedBudget : budget),
        isLoading:false
      }));
      toast.success('예산 정보가 수정되었어요!');
    } catch (error) {
      set({error, isLoading: false});
      toast.error('예산 수정에 실패했어요.');
      // 에러 발생해도 원래 목록 다시 불러옴 -> UI 안정적으로 유지 위해
      get().getBudgets();
    }
  },

  // 단일 예산 조회
  getBudgetById: async (id) => {
    set({isLoading: true, error: null});
    try {
      const { data } = await fetchBudgetById(id);
      set({ selectedBudget: data, isLoading: false });
    } catch(error) {
      set({error, isLoading: false});
      console.error('예산 조회 실패', error);
    }
  },

  addExpense: async (budgetId, newExpenseData) => {
    try{
      const { data: updatedBudget} = await apiAddExpense(budgetId, newExpenseData);
      set({selectedBudget: updatedBudget});
      toast.success('지출 내역이 추가되었어요.');
    } catch (error) {
      console.error('지출 항목 추가 실패', error);
      toast.error('지출 내역 추가에 실패했어요.');
    }
  },

  deleteExpense: async (budgetId, expenseId) => {
    try {
      const {data: updatedBudget} = await apiDeleteExpense(budgetId, expenseId);
      set ({selectedBudget: updatedBudget});
      toast.success('지출 내역이 삭제되었어요.');
    } catch (error) {
      console.error('지출 항목 삭제 실패', error);
      toast.error('지출 내역 삭제에 실패했어요.');
    }
  },

  updateExpense: async (budgetId, expenseId, updatedExpense) => {
    try {
      const { data: updatedBudget } = await apiUpdateExpense(budgetId, expenseId, updatedExpense);
      set({selectedBudget: updatedBudget});
      toast.success('지출 내역이 수정되었어요.');
    } catch(error){
      console.error('지출 항목 수정 실패', error);
      toast.error('지출 내역 수정에 실패했어요.');
    }
  } 

}));

export default useBudgetStore;