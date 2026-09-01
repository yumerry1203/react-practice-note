import { useReducer } from 'react'
import { PracticeLayout } from '../components/PracticeLayout'
import { productReducer } from '../store/productReducer'
import type { ProductState } from '../type/product'
import { taxCalculator } from '../utils/taxCalculator'

const initialState: ProductState = {
  productId: 101,
  price: 50000,
}

export function TaxCalculatorPage() {
  const [state, dispatch] = useReducer(productReducer, initialState)
  const trackingCode = taxCalculator(state)

  return (
    <PracticeLayout title="TS 마이그레이션 솔루션">
      <p className="practice-memo">interface와 type을 활용해 데이터와 명령의 표준 규격을 정의</p>
      <section className="tax-practice" aria-labelledby="product-center-title">
        <p className="data-list-label">PRODUCT STATE · TYPESCRIPT</p>
        <h2 id="product-center-title">📦 상품 정보 센터</h2>
        <dl>
          <div><dt>상품 식별 번호</dt><dd>{state.productId}</dd></div>
          <div><dt>현재 설정 가격</dt><dd>{state.price.toLocaleString()}원</dd></div>
        </dl>
        <div className="tax-engine">
          <span>🛡️ 보안 세금 엔진 가동 중</span>
          <p>검증된 추적 코드 <strong>{trackingCode}</strong></p>
        </div>
        <button className="tax-update-button" onClick={() => dispatch({ type: 'UPDATE_PRICE', payload: 65000 })}>
          가격 업데이트 (계약 준수)
        </button>
      </section>
      <section className="study-summary" aria-labelledby="tax-summary-title">
        <p className="data-list-label">STUDY SUMMARY</p>
        <h2 id="tax-summary-title">오늘의 핵심 내용</h2>
        <ul>
          <li><strong>interface</strong>는 상품 상태가 가져야 할 데이터 모양을 정해, 숫자가 아닌 값이 들어오는 것을 막습니다.</li>
          <li><strong>Union Type</strong>으로 리듀서가 처리할 수 있는 명령을 제한하면 오타나 잘못된 action을 컴파일 단계에서 차단할 수 있습니다.</li>
          <li><strong>useReducer</strong>는 정해진 ProductAction만 dispatch하도록 만들어 상태 변경 흐름을 예측 가능하게 합니다.</li>
          <li><strong>taxCalculator</strong>는 ProductState만 받아 <code>101 + 100 = 201</code>처럼 안전한 숫자 연산을 보장합니다.</li>
        </ul>
      </section>
    </PracticeLayout>
  )
}
