import { PracticeLayout } from '../components/PracticeLayout'
import { UserProfile } from '../components/UserProfile'
import { currentUser } from '../data/userProfileData'

export function UserProfilePage() {
  return (
    <PracticeLayout title="프로필 카드 만들기">
      <p className="practice-memo">Props와 타입을 이용해 사용자 정보를 카드 컴포넌트로 표현해 보았습니다.</p>
      <div className="practice-demo"><UserProfile user={currentUser} /></div>
    </PracticeLayout>
  )
}
