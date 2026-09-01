import { CustomButton } from '../components/CustomButton'
import { PracticeLayout } from '../components/PracticeLayout'

export function CustomButtonPage() {
  return (
    <PracticeLayout title="커스텀 버튼 만들기">
      <p className="practice-memo">ComponentPropsWithRef로 기본 button 속성을 이어받아 재사용 가능한 버튼을 만들었습니다.</p>
      <div className="practice-demo"><CustomButton CustomColor="primary">CustomButton</CustomButton></div>
    </PracticeLayout>
  )
}
