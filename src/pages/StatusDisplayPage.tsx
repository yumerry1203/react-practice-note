import { PracticeLayout } from '../components/PracticeLayout'
import { StatusDisplay } from '../components/StatusDisplay'

export function StatusDisplayPage() {
  return (
    <PracticeLayout title="상태별 데이터 표시">
      <p className="practice-memo">loading, success, error 상태에 따라 안전하게 다른 화면을 보여주는 실습입니다.</p>
      <div className="practice-demo status-demo">
        <StatusDisplay status={{ state: 'loading' }} />
        <StatusDisplay status={{ state: 'success', data: '프로필 데이터를 불러왔습니다.' }} />
        <StatusDisplay status={{ state: 'error', error: new Error('데이터를 불러오지 못했습니다.') }} />
      </div>
    </PracticeLayout>
  )
}
