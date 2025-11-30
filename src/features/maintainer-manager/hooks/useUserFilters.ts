/**
 * useUserFilters Hook
 *
 * 封裝使用者搜尋與篩選邏輯，包含 debounce 處理
 */

import { useState, useEffect } from 'react';

interface UseUserFiltersReturn {
  /** 實際搜尋關鍵字（debounced） */
  searchKeyword: string;
  /** 狀態篩選 */
  statusFilter: string;
  /** 設定搜尋關鍵字 */
  setSearchKeyword: (keyword: string) => void;
  /** 設定狀態篩選 */
  setStatusFilter: (status: string) => void;
}

/**
 * 使用者篩選 Hook
 *
 * @param debounceMs - Debounce 延遲時間（預設 300ms）
 * @returns 篩選狀態與設定函數
 */
export const useUserFilters = (debounceMs: number = 300): UseUserFiltersReturn => {
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  /**
   * Debounce 處理搜尋關鍵字
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchInput);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, debounceMs]);

  return {
    searchKeyword,
    statusFilter,
    setSearchKeyword: setSearchInput,
    setStatusFilter,
  };
};