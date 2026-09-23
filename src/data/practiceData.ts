export type PracticeTone = 'lilac' | 'pink' | 'peach' | 'lavender'

export interface Practice {
  number: string
  icon: string
  title: string
  description: string
  path: string
  tone: PracticeTone
}

export interface PracticeGroup {
  date: string
  practices: Practice[]
}

const august28Practices: Practice[] = [
  { number: '01', icon: '◉', title: '프로필 카드 만들기', description: 'Props와 타입으로 나만의 프로필 카드 구성하기', path: '/user-profile', tone: 'lilac' },
  { number: '02', icon: '✦', title: '상태별 데이터 표시', description: '구별된 공용체로 안전한 UI 상태 다루기', path: '/status-display', tone: 'pink' },
  { number: '03', icon: '⌘', title: '커스텀 버튼 만들기', description: 'HTML 버튼 속성을 확장해 재사용하기', path: '/custom-button', tone: 'peach' },
  { number: '04', icon: '↗', title: '이벤트와 스타일 정밀 조작', description: '입력값과 이벤트를 타입 안전하게 다루기', path: '/input-field', tone: 'lavender' },
]

export const practiceGroups: PracticeGroup[] = [
  { date: '2026.09.23(수)', practices: [{ number: '09', icon: '⊞', title: '인터페이스 확장과 유틸리티 타입', description: 'extends, Omit, Partial로 타입을 유연하게 다루기', path: '/utility-types', tone: 'peach' }] },
  { date: '2026.09.11(금)', practices: [{ number: '08', icon: '⌂', title: 'Zustand: 필요한 상태만 구독하기', description: '중앙 Store와 셀렉터로 상태 관리하기', path: '/zustand-counter', tone: 'lilac' }] },
  { date: '2026.09.01(화)', practices: [{ number: '07', icon: '⌁', title: 'TS 마이그레이션 솔루션', description: '타입 규격으로 안전한 데이터 흐름 만들기', path: '/tax-calculator', tone: 'lavender' }] },
  { date: '2026.08.31(월)', practices: [{ number: '05', icon: '⌘', title: '제네릭 실습: 마법의 거푸집', description: '하나의 목록으로 서로 다른 타입 다루기', path: '/data-list', tone: 'pink' }] },
  { date: '2026.08.28(금)', practices: august28Practices },
]

export const dailyQuotes = [
  '완벽한 시작보다, 오늘의 작은 완료가 더 멀리 데려간다.',
  '배운 것을 손으로 만들 때, 지식은 내 것이 된다.',
  '조금씩 쌓인 코드가 결국 나만의 방향을 만든다.',
  '막히는 순간도 이해가 자라는 과정이다.',
  '오늘의 연습은 내일의 자신감을 위한 한 줄이다.',
]
