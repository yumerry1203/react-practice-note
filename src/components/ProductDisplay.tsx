interface Product {
  id: string
  name: string
  price: number
  adminNote: string
  secretToken: string
}

type UserViewProduct = Omit<Product, 'adminNote' | 'secretToken'>

interface ProductDetailProps {
  product: UserViewProduct
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="utility-product-card">
      <h3>📦 상품 정보</h3>
      <dl>
        <div><dt>상품 ID</dt><dd>{product.id}</dd></div>
        <div><dt>상품명</dt><dd>{product.name}</dd></div>
        <div><dt>판매가</dt><dd>{product.price.toLocaleString()}원</dd></div>
      </dl>
      <p>관리자 메모와 인증 토큰은 <code>Omit</code>으로 화면 타입에서 제외했어요.</p>
    </div>
  )
}
