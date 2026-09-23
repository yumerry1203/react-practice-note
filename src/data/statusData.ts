import type { FetchStatus } from '../components/StatusDisplay'

export const statusExamples: FetchStatus[] = [
  { state: 'loading' },
  { state: 'success', data: '프로필 데이터를 불러왔습니다.' },
  { state: 'error', error: new Error('데이터를 불러오지 못했습니다.') },
]
