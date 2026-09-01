import { InputField } from '../components/InputField'
import { PracticeLayout } from '../components/PracticeLayout'

export function InputFieldPage() {
  return (
    <PracticeLayout title="이벤트와 스타일 정밀 조작">
      <p className="practice-memo">입력 이벤트의 타입을 지정하고, 입력값을 실시간으로 화면에 반영하는 실습입니다.</p>
      <div className="practice-demo"><InputField /></div>
    </PracticeLayout>
  )
}
