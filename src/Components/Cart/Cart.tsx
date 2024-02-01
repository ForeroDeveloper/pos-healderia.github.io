/* eslint-disable @typescript-eslint/no-explicit-any */
import CarItem from "./CarItem";
const Cart = ({ cart, productSelected, isCreated, setProduct }: any) => {

  return (
    <>
      {cart.map((item: any) => (
          <CarItem productSelected={productSelected} item={item} key={item.id} isCreated={isCreated} setProduct={setProduct}/>
      ))}
    </>
  );
};

export default Cart;
