import { PracticeLayout } from '../components/PracticeLayout'
import { StatusDisplay } from '../components/StatusDisplay'
import { statusExamples } from '../data/statusData'

export function StatusDisplayPage() {
  return (
    <PracticeLayout title="상태별 데이터 표시">
      <p className="practice-memo">loading, success, error 상태에 따라 안전하게 다른 화면을 보여주는 실습입니다.</p>
      <div className="practice-demo status-demo">
        {statusExamples.map((status) => <StatusDisplay key={status.state} status={status} />)}
      </div>
    </PracticeLayout>
  )
}
