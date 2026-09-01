import type { ComponentPropsWithRef } from "react";

interface CustomButtonProps extends Omit<ComponentPropsWithRef<'button'> , 'color'> {
  CustomColor:'primary' | 'secondary';
  children:React.ReactNode;
}
export function CustomButton( {children, CustomColor, style, ...rest}:CustomButtonProps ){
  const ButtonStyle:React.CSSProperties = {
    backgroundColor: CustomColor === 'primary' ? '#646cff' : '#2f3640',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    ...style // 외부 스타일과 합성
  }
  return(
    <button style={ButtonStyle} {...rest}>
      {children}
    </button> 
  );
}