import { useState } from 'react';

export function InputField() {
	const [text, setText] = useState<string>("");
	/**
   * React.ChangeEvent<HTMLInputElement>:
   * 입력창 전용 이벤트 이름표입니다. e.target이 무엇인지 명확히 알려줍니다.
   */
	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	}
	const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    margin: '20px 0'
  };

  return (
    <div style={containerStyle}>
      <label style={{ fontWeight: 'bold' }}>실시간 설계도 검증:</label>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="내용을 입력하세요"
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '250px' }}
      />
      <p>입력된 값: <span style={{ color: '#646cff' }}>{text}</span></p>
    </div>
  );
}