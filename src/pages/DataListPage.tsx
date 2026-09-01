import { DataList } from '../components/DataList'
import { PracticeLayout } from '../components/PracticeLayout'
import type { User } from '../type/user'
import { wrapWithMetadata } from '../utils/wrapWithMetadata'

interface Product {
  id: string
  title: string
  price: number
}

export function DataListPage() {
  const users: User[] = [
    { id: 1, displayName: 'Alice' },
    { id: 2, displayName: 'Bob' },
  ]
  const products: Product[] = [
    { id: 'p1', title: 'TypeScript 장인 키보드', price: 150000 },
    { id: 'p2', title: '아키텍트 설계 마우스', price: 89000 },
  ]
  const userList = wrapWithMetadata(users)
  const productList = wrapWithMetadata(products)

  return (
    <PracticeLayout title="제네릭 실습: 마법의 거푸집">
      <p className="practice-memo">extends 제약으로 id를 보장한 하나의 DataList 컴포넌트에 User와 Product 타입을 각각 주입해 보았습니다.</p>
      <div className="data-list-practice">
        <section className="data-list-section">
          <p className="data-list-label">USER TYPE · {userList.id}</p>
          <h2>👥 사용자 목록</h2>
          <DataList<User>
            items={userList.data}
            renderRow={(user) => <div className="data-row"><strong>{user.displayName}</strong><span>ID: {user.id}</span></div>}
          />
        </section>
        <section className="data-list-section">
          <p className="data-list-label">PRODUCT TYPE · {productList.id}</p>
          <h2>📦 상품 목록</h2>
          <DataList<Product>
            items={productList.data}
            renderRow={(product) => <div className="data-row"><span>{product.title}</span><strong>{product.price.toLocaleString()}원</strong></div>}
          />
        </section>
      </div>
      <section className="study-summary" aria-labelledby="summary-title">
        <p className="data-list-label">STUDY SUMMARY</p>
        <h2 id="summary-title">핵심 정리</h2>
        <ul>
          <li><strong>제네릭</strong>은 타입을 미리 고정하지 않고, 사용할 때 타입을 주입해 같은 코드를 다양하게 재사용하는 방법입니다.</li>
          <li><strong>any</strong>와 달리 전달받은 데이터의 타입 정보를 끝까지 유지하므로 자동 완성과 오류 검사가 안전하게 동작합니다.</li>
          <li><code>T extends {'{ id: string | number }'}</code>는 모든 데이터가 최소한 <code>id</code>를 갖도록 보장해 목록의 <code>key</code>를 안전하게 만들 수 있습니다.</li>
          <li><code>DataList</code>는 목록 구조를 맡고, <code>renderRow</code>는 각 타입에 맞는 내용을 그리도록 분리한 재사용 가능한 컴포넌트입니다.</li>
        </ul>
      </section>
    </PracticeLayout>
  )
}
