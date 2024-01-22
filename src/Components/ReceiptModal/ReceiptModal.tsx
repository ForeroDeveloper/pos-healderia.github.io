/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import producto1Image from "../../assets/food-example/food1.png";

const ReceiptModal = ({
  isShowModalReceipt = true,
  //   closeModalReceipt = () => {},
  receiptNo = "1",
  //   receiptDate = new Date(),
  cart,
  //   getTotalPrice = () => {},
  cash = 0,
  change = 0,
}: //   printAndProceed = false,
any) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div
      className={`fixed w-full h-[70vh] left-0 top-40 z-10 flex flex-wrap justify-center content-center p-0 ${
        isShowModalReceipt ? "" : "hidden"
      }`}
    >
      <div
        className="fixed glass w-full h-screen left-0 top-0 z-0"
        // onClick={closeModalReceipt}
      ></div>
      <div className="w-96 rounded-3xl bg-white shadow-xl overflow-hidden z-10 text-gray-500">
        <div className="text-left w-full text-sm p-6 overflow-auto">
          <div className="text-center">
            <img
              src={producto1Image}
              alt="Tailwind POS"
              className="mb-3 w-8 h-8 inline-block"
            />
            <h2 className="text-xl font-semibold">MANDAR A COCINA</h2>
            <p>CABANG KONOHA SELATAN</p>
          </div>
          <div className="flex mt-4 text-xs">
            <div className="flex-grow">
              No: <span>{receiptNo}</span>
            </div>
            <div>{"receiptDate"}</div>
          </div>
          <hr className="my-2" />
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="py-1 w-1/12 text-center">#</th>
                  <th className="py-1 text-left">Item</th>
                  <th className="py-1 w-2/12 text-center">Qty</th>
                  <th className="py-1 w-3/12 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item: any, index: any) => (
                  <tr key={index}>
                    <td className="py-2 text-center">{index + 1}</td>
                    <td className="py-2 text-left">
                      <span>{item.name}</span>
                      <br />
                      <small>
                        {new Intl.NumberFormat().format(item.price)}
                      </small>
                    </td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">
                      {new Intl.NumberFormat().format(
                        item.quantity * item.price
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr className="my-2" />
          <div>
            <div className="flex font-semibold">
              <div className="flex-grow">TOTAL</div>
              <div>{new Intl.NumberFormat().format(100)}</div>
            </div>
            <div className="flex text-xs font-semibold">
              <div className="flex-grow">PAY AMOUNT</div>
              <div>{new Intl.NumberFormat().format(cash)}</div>
            </div>
            <hr className="my-2" />
            <div className="flex text-xs font-semibold">
              <div className="flex-grow">CHANGE</div>
              <div>{new Intl.NumberFormat().format(change)}</div>
            </div>
          </div>
        </div>
        <div className="p-4 w-full">
          <div className="flex items-center mb-4 ml-2">
            <input
              type="checkbox"
              id="exampleCheckbox"
              className="form-checkbox h-5 w-5 text-blue-500 focus:ring-blue-300 border-gray-300 rounded-md"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="exampleCheckbox" className="ml-2 text-gray-700">
              Es un Domicilio?
            </label>
          </div>
          <button
            className="bg-cyan-500 text-white text-lg px-4 py-3 rounded-2xl w-full focus:outline-none"
            // onClick={printAndProceed}
          >
            IMPRIMIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
