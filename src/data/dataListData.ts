import type { User } from '../type/user'

export interface Product {
  id: string
  title: string
  price: number
}

export const users: User[] = [
  { id: 1, displayName: 'Alice' },
  { id: 2, displayName: 'Bob' },
]

export const products: Product[] = [
  { id: 'p1', title: 'TypeScript 장인 키보드', price: 150000 },
  { id: 'p2', title: '아키텍트 설계 마우스', price: 89000 },
]
