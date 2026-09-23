import { PrimaryButton } from '../components/PrimaryButton'
import { ProductDetail } from '../components/ProductDisplay'
import { ProfileEditor } from '../components/ProfileEditor'
import { PracticeLayout } from '../components/PracticeLayout'

export function UtilityTypesPage() {
  return (
    <PracticeLayout title="인터페이스 확장과 유틸리티 타입">
      <p className="practice-memo">표준 HTML 속성을 안전하게 이어받고, 기존 타입을 필요한 용도에 맞게 확장·가공하는 방법을 실습했습니다.</p>
      <div className="utility-practice">
        <section className="utility-section" aria-labelledby="utility-button-title">
          <p className="data-list-label">COMPONENT PROPS · EXTENDS</p>
          <h2 id="utility-button-title">표준 속성을 확장한 버튼</h2>
          <p><code>ComponentPropsWithoutRef&lt;'button'&gt;</code>로 기본 버튼 속성을 그대로 사용할 수 있어요.</p>
          <div className="utility-button-row">
            <PrimaryButton title="title 속성도 그대로 전달됩니다" variant="solid">상속받은 표준 버튼</PrimaryButton>
            <PrimaryButton isLoading variant="outline">로딩 버튼</PrimaryButton>
          </div>
        </section>
        <section className="utility-section" aria-labelledby="utility-product-title">
          <p className="data-list-label">OMIT · DATA SECURITY</p>
          <h2 id="utility-product-title">데이터 정밀 가공</h2>
          <ProductDetail product={{ id: 'A101', name: '고급 리액트 가이드', price: 45000 }} />
        </section>
        <section className="utility-section" aria-labelledby="utility-profile-title">
          <p className="data-list-label">PARTIAL · PATCH PATTERN</p>
          <h2 id="utility-profile-title">유연한 부분 수정</h2>
          <ProfileEditor />
        </section>
      </div>
      <section className="study-summary" aria-labelledby="utility-summary-title">
        <p className="data-list-label">STUDY SUMMARY</p>
        <h2 id="utility-summary-title">오늘의 핵심 내용</h2>
        <ul>
          <li><code>ComponentPropsWithoutRef</code>는 HTML 태그의 표준 속성을 안전하게 재사용할 수 있게 해줍니다.</li>
          <li><code>extends</code>로 기존 인터페이스의 공통 규격을 이어받고, 필요한 기능만 더할 수 있습니다.</li>
          <li><code>Pick</code>은 필요한 속성만 고르고, <code>Omit</code>은 노출하면 안 되는 속성을 제외합니다.</li>
          <li><code>Partial</code>은 모든 속성을 선택 사항으로 바꿔 필요한 값만 수정하는 업데이트에 적합합니다.</li>
        </ul>
      </section>
    </PracticeLayout>
  )
}
