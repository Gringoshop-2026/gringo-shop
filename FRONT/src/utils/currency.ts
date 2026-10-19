export function convertPrice(price:number,base:string,target:string,rate:number){
 if(base===target)return price
 if(!Number.isFinite(rate)||rate<=0)throw new Error('Tipo de cambio inválido')
 return target==='USD'?price/rate:price*rate
}
