import { PracticeLayout } from '../components/PracticeLayout'
import { UserProfile } from '../components/UserProfile'
import type { User } from '../type/user'

export function UserProfilePage() {
  const currentUser: User = { id: 10054, displayName: '이유로' }

  return (
    <PracticeLayout title="프로필 카드 만들기">
      <p className="practice-memo">Props와 타입을 이용해 사용자 정보를 카드 컴포넌트로 표현해 보았습니다.</p>
      <div className="practice-demo"><UserProfile user={currentUser} /></div>
    </PracticeLayout>
  )
}
