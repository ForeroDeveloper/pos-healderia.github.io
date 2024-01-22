/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

const Cart = ({ cart, productSelected }: any) => {
    const selectedProductRef = useRef<any>(null);

    useEffect(() => {
        // Ajustar el scroll para que el producto seleccionado sea visible
        if (selectedProductRef.current) {
          selectedProductRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }
      }, [productSelected]);

  return (
    <>
      {cart.map((item: any) => (
        <div
          key={item.id}
          ref={productSelected?.id === item?.id ? selectedProductRef : null}
          className={`mb-0 border-t-2 ${productSelected?.id === item?.id ? "bg-green-100" : "bg-blue-gray-50"} w-full text-blue-gray-700 py-2 px-2 flex justify-center`}
        >
          <div className="flex-grow flex justify-between">
            <div>
              <h5 className="text-sm text-left whitespace-normal font-semibold">
                {item?.name}
              </h5>
              <h5 className="text-sm text-left whitespace-normal ml-2">
                <b>{item?.quantity}</b> Unidades x $ {new Intl.NumberFormat().format(item?.price)} / Unidad
              </h5>
            </div>
            <p className="text-sm text-right block font-bold">
              $ {new Intl.NumberFormat().format(item?.price * item?.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Cart;
