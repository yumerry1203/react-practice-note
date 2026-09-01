
export function wrapWithMetadata<T>(content:T){
    return{
        data:content,// 원본 데이터 (T 타입을 그대로 유지)
        timestamp:Date.now(), //데이터 생성시간
        id:Math.random().toString(36).substring(2, 9) //고유 식별자
    }
}