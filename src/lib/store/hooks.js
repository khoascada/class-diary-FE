import { useDispatch, useSelector } from 'react-redux'
import { store } from './index'

// Custom hooks (JS version - không cần type)
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

// này chưa cần thiết, khi nào cần log dispatch, thêm prefix, handle errors…
