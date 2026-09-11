import { PracticeLayout } from '../components/PracticeLayout'
import { useCounterStore } from '../store/useCounterStore'

export function ZustandCounterPage() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)
  const reset = useCounterStore((state) => state.reset)

  return (
    <PracticeLayout title="Zustand: 필요한 상태만 구독하기">
      <p className="practice-memo">Context API의 Provider 구조 대신, 컴포넌트 밖의 중앙 Store에서 필요한 상태 조각만 선택해 가져오는 Zustand 카운터를 실습했습니다.</p>
      <section className="zustand-demo" aria-labelledby="zustand-demo-title">
        <p className="data-list-label">ZUSTAND STORE · SELECTOR</p>
        <h2 id="zustand-demo-title">중앙 창고 카운터</h2>
        <p className="selector-note"><code>state =&gt; state.count</code> 셀렉터로 count만 구독 중입니다.</p>
        <output className="counter-value" aria-live="polite">{count}</output>
        <div className="zustand-actions">
          <button type="button" onClick={increment}>+ 1 증가</button>
          <button className="reset-button" type="button" onClick={reset}>초기화</button>
        </div>
      </section>
      <section className="study-summary" aria-labelledby="zustand-summary-title">
        <p className="data-list-label">STUDY SUMMARY</p>
        <h2 id="zustand-summary-title">오늘의 핵심 내용</h2>
        <ul>
          <li><strong>Context API</strong>는 Provider와 커스텀 훅 등 준비 코드가 많고, 값이 바뀌면 연결된 소비자가 함께 다시 렌더링될 수 있습니다.</li>
          <li><strong>Zustand</strong>는 컴포넌트 트리 밖에 독립적인 Store를 두므로 Provider로 감쌀 필요 없이 어디서나 사용할 수 있습니다.</li>
          <li><strong>셀렉터</strong> <code>(state) =&gt; state.count</code>를 사용하면 Store 전체가 아니라 필요한 상태 조각의 변경에만 반응합니다.</li>
          <li><strong>set</strong> 함수로 이전 상태를 안전하게 받아 불변성을 지키며 상태를 업데이트할 수 있습니다.</li>
        </ul>
      </section>
    </PracticeLayout>
  )
}
