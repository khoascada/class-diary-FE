import { useDispatch, useSelector } from 'react-redux'
import { store } from './index'

// Custom hooks (JS version - không cần type)
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

// Nếu muốn hint type cho VSCode bằng JSDoc thì có thể thêm:
/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */
