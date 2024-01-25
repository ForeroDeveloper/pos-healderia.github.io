/* eslint-disable @typescript-eslint/no-explicit-any */
import CarItem from "./CarItem";
const Cart = ({ cart, productSelected }: any) => {

  return (
    <>
      {cart.map((item: any) => (
          <CarItem productSelected={productSelected} item={item} key={item.id}/>
      ))}
    </>
  );
};

export default Cart;
