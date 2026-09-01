interface DataListProps<T extends {id: string | number }>{
  items:T[];
  renderRow: (item: T) => React.ReactNode;// 각 아이템을 어떻게 그릴지 정의하는 콜백 함수
}

/**
 * 제네릭 컴포넌트 DataList
 * T가 최소한 id를 가지고 있음을 extends로 보장받았기 때문에,
 * map 함수 내부에서 안전하게 item.id를 key로 사용할 수 있습니다.
 */

export function DataList<T extends {id: string | number}> ({
  items,
  renderRow
} : DataListProps<T>){
  return (
    <div style={{
      border: '1px solid #e1e4e8',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '20px',
      backgroundColor: '#fff'
    }}>
      {items.map((item, index) => (
        <div
          key={item.id} // extends 덕분에 에러 없이 id 접근 가능!
          style={{
            padding: '12px 20px',
            borderBottom: index === items.length - 1 ? 'none' : '1px solid #eee'
          }}
        >
          {/* 외부에서 주입받은 렌더링 로직으로 각 아이템을 그립니다. */}
          {renderRow(item)}
        </div>
      ))}
    </div>
  );
}