/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { MutableRefObject, useEffect, useRef, useState } from "react";
import "./App.css";
import Cart from "./Components/Cart/Cart";
import producto1Image from "./assets/food-example/food1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHouse,
  faDeleteLeft,
  faRightToBracket,
  faUtensils,
  faBox,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "./Components/Modal/Modal";
import TableOrders from "./Components/TableOrders/TableOrders";
import CsvUploader from "./Components/CsvUploader/CsvUploader";
import TableInventory from "./Components/TableInventory/TableInventory";
import { useProductContext } from "./context/ProductContext/ProductContext";

declare global {
  interface Window {
      Toaster: any;
  }
}

const OnScreenKeyboard = ({ onKeyPress }: any) => {
  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Del"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ", "Enter"],
    ["Z", "X", "C", "V", "B", "N", "M", "!", "?", ";", "."],
    ["Espacio"],
  ];

  const handleKeyPress = (key: any) => {
    onKeyPress(key);
  };

  return (
    <div className="fixed flex justify-center bottom-0 left-0 w-full bg-white border-t border-gray-300 py-2">
      <div className="w-5/5">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex w-[75%] items-center mx-auto">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`m-1 p-2 bg-gray-300 rounded ${
                  key === "Espacio" ? "w-[50%] mx-auto" : "w-[5.2rem]"
                } h-10`}
              >
                {key === "Del" ? (
                  <span>
                    <FontAwesomeIcon icon={faDeleteLeft} color="red" />
                  </span>
                ) : key === "Enter" ? (
                  <FontAwesomeIcon icon={faRightToBracket} color="black" />
                ) : (
                  key
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
function App() {
  const [inputValue, setInputValue] = useState("");
  const [productSelected, setProductSelected] = useState<any>();
  const [valueInPayment, setValueInPayment] = useState<string>("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalCockIsOpen, setModalCockIsOpen] = useState(false);
  const [pageView, setPageView] = useState("sales");
  const {
    productList,
    addProductOrder,
    productsInOrder,
    updateProductOrder,
    categoriesList,
  } = useProductContext();

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const ejemploDeCarrito = [
    {
      id: 1,
      name: "GASEOSA PERSONAL COLOMBIANA",
      price: 19.99,
      imageUrl: producto1Image,
      quantity: 1,
    },
    {
      id: 2,
      name: "Producto 2",
      price: 29.99,
      imageUrl: producto1Image,
      quantity: 2,
    },
    {
      id: 3,
      name: "Producto 3",
      price: 14.99,
      imageUrl: producto1Image,
      quantity: 1,
    },
    {
      id: 4,
      name: "Producto 3",
      price: 14.99,
      imageUrl: producto1Image,
      quantity: 1,
    },
    {
      id: 5,
      name: "Producto 3",
      price: 14.99,
      imageUrl: producto1Image,
      quantity: 1,
    },
    {
      id: 6,
      name: "Producto 3",
      price: 14.99,
      imageUrl: producto1Image,
      quantity: 1,
    },
    {
      id: 7,
      name: "Producto 3",
      price: 14.99,
      imageUrl: producto1Image,
      quantity: 1,
    },
  ];

  // const productos = [
  //   { id: 1, nombre: "Aloha Mix", precio: 15000, imagen: producto1Image },
  //   { id: 2, nombre: "Producto 2", precio: 20000, imagen: producto1Image },
  //   { id: 3, nombre: "Producto 3", precio: 25000, imagen: producto1Image },
  //   { id: 4, nombre: "Producto 3", precio: 25000, imagen: producto1Image },
  //   { id: 5, nombre: "Producto 3", precio: 25000, imagen: producto1Image },
  //   // Agrega más productos según sea necesario
  // ];

  // const moneys = [
  //   { id: 1, value: 2000 },
  //   { id: 2, value: 5000 },
  //   { id: 3, value: 10000 },
  //   { id: 4, value: 20000 },
  //   { id: 5, value: 50000 },
  //   { id: 6, value: 100000 },
  // ];

  const buttonsData = [
    { id: 1, label: "1", value: 1 },
    { id: 2, label: "2", value: 2 },
    { id: 3, label: "3", value: 3 },
    { id: 15, label: "<--", value: "borrar" },
    { id: 4, label: "4", value: 4 },
    { id: 5, label: "5", value: 5 },
    { id: 6, label: "6", value: 6 },
    { id: 11, label: "%Des", value: "descuento" },
    { id: 7, label: "7", value: 7 },
    { id: 8, label: "8", value: 8 },
    { id: 9, label: "9", value: 9 },
    { id: 12, label: "Prec", value: "precio" },
    { id: 13, label: "+/-", value: "restar" },
    { id: 0, label: "0", value: 0 },
    { id: 14, label: ",", value: "," },
    { id: 10, label: "Can", value: "cantidad" },
  ];
  const buttonsDataModal = [
    { id: 1, label: "1", value: 1 },
    { id: 2, label: "2", value: 2 },
    { id: 3, label: "3", value: 3 },
    { id: 11, label: "+500", value: 500 },
    { id: 4, label: "4", value: 4 },
    { id: 5, label: "5", value: 5 },
    { id: 6, label: "6", value: 6 },
    { id: 12, label: "+1.000", value: 1000 },
    { id: 7, label: "7", value: 7 },
    { id: 8, label: "8", value: 8 },
    { id: 9, label: "9", value: 9 },
    { id: 10, label: "+5.000", value: 5000 },

    { id: 13, label: "", value: "no-action" },
    { id: 0, label: "0", value: 0 },
    { id: 14, label: "", value: "no-action" },
    { id: 15, label: "<--", value: "borrar" },
  ];
  // const categorias = [
  //   { id: 3, label: "Preparados", value: 3 },
  //   { id: 2, label: "Bebidas", value: 2 },
  //   { id: 1, label: "Empaquetados", value: 1 },
  // ];
  const ordersStatus = [
    { id: 3, label: "En Cocina", value: 3 },
    { id: 2, label: "Finalizadas", value: 2 },
    { id: 1, label: "Canceladas", value: 1 },
  ];

  // function addCash(money: number): void {}

  const handleKeyPress = (key: any) => {
    if (key === "Del") {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (key == "Espacio") {
      setInputValue((prev) => prev + " ");
    } else if (key == "Enter") {
      setInputValue("");
      setShowKeyboard(false);
    } else {
      setInputValue((prev) => prev + key);
    }
  };
  const printAreaRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  // const imprimir = () => {
  //   const payload =
  //     '{"impresora":"66:32:FF:93:47:C0","serial":"","operaciones":[{"nombre":"Iniciar","argumentos":[]},{"nombre":"EstablecerTamañoFuente","argumentos":[1,1]},{"nombre":"EstablecerEnfatizado","argumentos":[false]},{"nombre":"EstablecerAlineacion","argumentos":[1]},{"nombre":"EstablecerSubrayado","argumentos":[false]},{"nombre":"EstablecerImpresionAlReves","argumentos":[false]},{"nombre":"EstablecerImpresionBlancoYNegroInversa","argumentos":[false]},{"nombre":"EstablecerRotacionDe90Grados","argumentos":[false]},{"nombre":"EscribirTexto","argumentos":["HolA MUNDO"]},{"nombre":"Feed","argumentos":[1]}]}';
  //   fetch("http://localhost:8000/imprimir", {
  //     method: "POST",
  //     body: payload,
  //   })
  //     .then((respuesta) => respuesta.json())
  //     .then((respuesta) => {
  //       if (respuesta === true) {
  //         // Éxito
  //         console.log("Impreso correctamente");
  //       } else {
  //         // Error (el mensaje de error está en "respuesta")
  //         console.log("Error con el plugin: " + respuesta);
  //       }
  //     })
  //     .catch((e) => {
  //       console.log(
  //         "Error haciendo petición. Verifica que el plugin se está ejecutando. El error dice: " +
  //           e
  //       );
  //     });
  // };

  const printAndProceed = () => {
    window.postMessage("Prueba de envio");
    window.Toaster.postMessage('Hola desde JS');


    const printArea = printAreaRef.current;
    if (printArea) {
      const titleBefore = document.title;
      document.title = "1";

      const clonedContent = printArea.cloneNode(true) as HTMLDivElement;
      document.body.appendChild(clonedContent);

      // window.print();
      // imprimir();

      document.title = titleBefore;
      document.body.removeChild(clonedContent);
    }
  };

  // useEffect(() => {
  //   // window.scrollTo({
  //   //   top: document.documentElement.scrollHeight,
  //   //   behavior: "smooth",
  //   // });
  // }, [pageView]);
  useEffect(() => {
    if (
      productsInOrder?.length > 0 &&
      productsInOrder?.findIndex(
        (products) => products?.id === productSelected?.id
      ) === -1
    ) {
      setProductSelected(productsInOrder[productsInOrder.length - 1]);
    }
  }, [productSelected, productsInOrder]);

  const calculateTotal = () => {
    const total = productsInOrder.reduce((acumulador, producto) => {
      return acumulador + producto.price * producto.quantity;
    }, 0);
    return total;
  };

  // const handleChangeCategory = (category: string) => {
  // };

  console.log(categoriesList);

  return (
    <>
      <div className="h-screen hide-print">
        {/* {No print area} */}
        <div className="w-full bg-cyan-800 h-11 py-2 pr-1 flex justify-end">
          <button
            className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md mr-3"
            onClick={() => setPageView("inventory")}
          >
            Inventario <FontAwesomeIcon icon={faBox} />
          </button>
          <button
            className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md"
            onClick={() => setPageView("orders")}
          >
            Ordenes <FontAwesomeIcon icon={faUtensils} />
          </button>
          <button
            className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md ml-3"
            onClick={() => setPageView("sales")}
          >
            Realizar venta <FontAwesomeIcon icon={faCartShopping} />
          </button>
        </div>

        {/* {Modulo de venta} */}
        <div className={`${pageView === "sales" ? "flex h-screen" : "hidden"}`}>
          {/* Left Bar */}
          <div className="lg:w-[40%]">
            <div className="bg-white flex flex-col h-full shadow text-blue-gray-800">
              <div className="flex-1 flex flex-col overflow-auto">
                {productsInOrder.length ? (
                  <div className="flex-1 w-full overflow-auto border-t-2">
                    <Cart
                      cart={productsInOrder}
                      productSelected={productSelected}
                    />
                  </div>
                ) : (
                  <div className="flex-1 w-full p-4 opacity-25 flex flex-col flex-wrap content-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p>CARRITO VACIO</p>
                  </div>
                )}

                <div className="h-auto w-full text-center pb-1 px-4">
                  <div className="flex text-lg font-semibold text-blue-gray-700">
                    <div>TOTAL</div>
                    <div className="text-right w-full font-bold">
                      ${new Intl.NumberFormat().format(calculateTotal())}
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col h-full w-2/5">
                    <div className="h-auto">
                      <button
                        className="text-white text-lg w-full h-full py-3 focus:outline-none bg-gray-500 hover:bg-cyan-600"
                        onClick={() => setModalCockIsOpen(!modalCockIsOpen)}
                      >
                        M. Cocina <FontAwesomeIcon icon={faUtensils} />
                      </button>
                    </div>
                    <div className="flex-grow">
                      <button
                        className="text-white text-lg w-full h-full py-3 focus:outline-none bg-cyan-500 hover:bg-cyan-600"
                        onClick={openModal}
                      >
                        Pagar
                      </button>
                    </div>
                  </div>
                  {/* {CALCULADORA} */}
                  <div className="grid grid-cols-4 gap-0 grid-rows-4 w-3/5">
                    {buttonsData.map((number) => (
                      <button
                        key={number.id}
                        onClick={() => {
                          if (number.value === "borrar") {
                            updateProductOrder(
                              productSelected.id,
                              productSelected
                            );
                          }
                        }}
                        className="bg-white text-gray p-3 hover:bg-gray-300 focus:outline-none border border-solid border-gray-500"
                      >
                        {number.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenedor principal para productos (Ocupa todo el espacio disponible) */}

          <div className="flex-1 overflow-y-auto">
            <div className="w-full bg-cyan-400 h-12 p-2 flex items-center overflow-hidden sticky top-0">
              <div className="flex w-full items-center">
                <FontAwesomeIcon icon={faHouse} size="2x" />

                <div className="flex w-full items-center">
                  {/* {categorias} */}
                  <div className="flex w-3/4 overflow-x-auto">
                    {categoriesList.map((categoria, index) => (
                      <button
                        className="text-sm font-semibold ml-3 hover:bg-cyan-300 bg-none rounded truncate p-[0.3rem]"
                        // onClick={() => handleChangeCategory(categoria)}
                        key={index + 1}
                      >
                        {categoria}
                      </button>
                    ))}
                  </div>
                </div>
                {/* {BUSCADOR} */}
                <div className="flex-shrink-0 w-1/4">
                  <button className="text-sm font-semibold bg-white shadow rounded-3xl truncate w-full h-9 flex">
                    <div className="rounded-full bg-cyan-500 text-white w-6 left-2 relative mt-2">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                    <input
                      type="text"
                      value={inputValue}
                      readOnly
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      className="w-full mr-2 text-left bg-none px-2 focus:outline-none text-gray-800 mt-2 ml-1 truncate"
                      placeholder="Buscar producto..."
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* {LISTA DE PRODUCTOS} */}
            <div className="grid grid-cols-4 gap-2 pb-2 text-gray-700 p-2">
              {productList.map((producto) => (
                <div
                  key={producto.id}
                  role="button"
                  onClick={() => {
                    addProductOrder(producto);
                    setProductSelected(producto);
                  }}
                  className="cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                >
                  <img
                    src={
                      producto?.image ||
                      "data:image/jpeg;base64,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"
                    }
                    alt={producto?.name}
                  />
                  <div className="flex flex-col pb-3 px-3 text-sm justify-start text-left">
                    <p className="flex-grow truncate mr-1">{producto.name}</p>
                    <p className="nowrap font-bold text-cyan-500">
                      $ {new Intl.NumberFormat().format(producto.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {showKeyboard && <OnScreenKeyboard onKeyPress={handleKeyPress} />}
          </div>

          {/* <ReceiptModal cart={ejemploDeCarrito}/> */}
        </div>
        {/* {Fin Modulo de venta} */}

        {/* {Modulo de lista de ordenes} */}
        <div
          className={`${
            pageView === "orders" ? "flex h-screen" : "hidden"
          } text-white`}
        >
          {/* {Contenedor de las ordenes} */}
          <div className="flex-1">
            <div className="w-full bg-cyan-400 h-12 p-2 flex items-center overflow-hidden">
              <div className="flex w-full items-center">
                <FontAwesomeIcon icon={faHouse} size="2x" />

                <div className="flex w-full items-center">
                  {/* {categorias} */}
                  <div className="flex w-3/4 overflow-x-auto">
                    {ordersStatus.map((categoria) => (
                      <button
                        className="text-sm font-semibold ml-3 hover:bg-cyan-300 bg-none rounded truncate p-[0.3rem]"
                        key={categoria.id}
                      >
                        {categoria.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* {BUSCADOR} */}
                <div className="flex-shrink-0 w-1/4">
                  <button className="text-sm font-semibold bg-white shadow rounded-3xl truncate w-full h-9 flex">
                    <div className="rounded-full bg-cyan-500 text-white w-6 left-2 relative mt-2">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
                    <input
                      type="text"
                      value={inputValue}
                      readOnly
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      className="w-full mr-2 text-left bg-none px-2 focus:outline-none text-gray-800 mt-2 ml-1 truncate"
                      placeholder="Buscar orden ID"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* {LISTA DE PRODUCTOS} */}
            <TableOrders />

            {showKeyboard && <OnScreenKeyboard onKeyPress={handleKeyPress} />}
          </div>
          {/* Right Bar */}
          <div className="w-2/5">
            <div className="bg-white flex flex-col h-full shadow text-blue-gray-800">
              <div className="flex-1 flex flex-col overflow-auto">
                <div className="flex-1 w-full overflow-auto mt-1">
                  <Cart cart={ejemploDeCarrito} />
                </div>

                <div className="h-auto w-full text-center pb-1 px-4">
                  <div className="flex text-lg font-semibold text-blue-gray-700">
                    <div>TOTAL</div>
                    <div className="text-right w-full">
                      ${new Intl.NumberFormat().format(calculateTotal())}
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col h-full w-full">
                    <div className="h-auto">
                      <button
                        className="text-white text-lg w-full h-full py-3 focus:outline-none bg-gray-500 hover:bg-cyan-600"
                        onClick={() => setModalCockIsOpen(!modalCockIsOpen)}
                      >
                        Editar Orden <FontAwesomeIcon icon={faUtensils} />
                      </button>
                    </div>
                    <div className="flex-grow">
                      <button
                        className="text-white text-lg w-full h-[80px] py-3 focus:outline-none bg-cyan-500 hover:bg-cyan-600 font-semibold"
                        onClick={openModal}
                      >
                        Pagar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {Modulo de Inventario} */}
        <div
          className={`${pageView === "inventory" ? "flex h-screen" : "hidden"}`}
        >
          {/* {Contenedor Inventario} */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full bg-white h-15 p-2 sticky top-0">
              <div className="flex w-full items-center ">
                <CsvUploader />
              </div>
            </div>

            <div className="text-gray-500">
              <TableInventory />
            </div>
          </div>
        </div>

        <Modal isOpen={modalIsOpen} onClose={closeModal}>
          <div className="w-[55vw] h-auto text-gray-700">
            {/* <h2 className="text-lg font-bold mb-2">Realizar Pago</h2> */}
            <div className="w-full p-2">
              <div className="flex text-lg font-semibold text-blue-gray-700">
                <div className="w-full">
                  <div className="flex w-full">
                    <span className="mr-2">Valor Ingresado</span>
                    <span className="text-red-500">
                      ${new Intl.NumberFormat().format(Number(valueInPayment))}
                    </span>
                  </div>
                  <div className="w-full flex font-normal text-gray-500">
                    <span className="mr-2">Total Venta</span>
                    <span>
                      ${new Intl.NumberFormat().format(calculateTotal())}
                    </span>
                  </div>
                </div>

                <div className="text-right w-full">
                  <span className="mr-2">Cambio</span>
                  <span className="text-blue-500">
                    $
                    {new Intl.NumberFormat().format(
                      Number(valueInPayment) > calculateTotal()
                        ? Number(valueInPayment) - calculateTotal()
                        : 0
                    )}
                  </span>
                </div>
              </div>
            </div>
            {/* {CALCULADORA Modal PAgo} */}
            <div className="grid grid-cols-4 gap-0 grid-rows-4">
              {buttonsDataModal.map((number) => (
                <button
                  key={number.id}
                  onClick={() => {
                    if (number.value === "borrar") {
                      setValueInPayment((prevValue) => prevValue.slice(0, -1));
                      return;
                    }
                    if (number.label.includes("+")) {
                      setValueInPayment((prevValue) => {
                        const newValue =
                          Number(prevValue) + Number(number.value);
                        return newValue.toString();
                      });
                      return;
                    }
                    if (number.value === "no-action") {
                      return;
                    }
                    setValueInPayment((prevValue) => {
                      return prevValue + number.value.toString();
                    });
                  }}
                  className="bg-white text-gray p-3 hover:bg-gray-200 focus:outline-none border border-solid border-gray-400 h-[70px]"
                >
                  {number.label === "<--" ? (
                    <FontAwesomeIcon
                      icon={faDeleteLeft}
                      color="red"
                      fontSize={22}
                    />
                  ) : (
                    number.label
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 mt-3 gap-1">
              <button
                className="text-white text-lg w-full h-[65px] py-3 focus:outline-none bg-red-500 hover:bg-red-600 rounded-md"
                onClick={closeModal}
              >
                Cerrar
              </button>
              <button className="text-white text-lg w-full h-[65px] py-3 focus:outline-none bg-green-400 hover:bg-green-500 rounded-md">
                Confirmar
              </button>
            </div>
          </div>
        </Modal>

        {/* {REcibo MOdal} */}
        <Modal
          isOpen={modalCockIsOpen}
          onClose={() => setModalCockIsOpen(!modalCockIsOpen)}
        >
          <div
            className="w-96 bg-white overflow-x-auto z-10 text-gray-500 h-[80vh] "
            ref={printAreaRef}
            id="print-area"
          >
            <div className="text-left w-full text-sm p-4 overflow-auto">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Pedido No: 13</h2>
              </div>
              <div className="flex mt-4 text-xs">
                <div className="flex-grow">
                  No: <span>{"receiptNo"}</span>
                </div>
                <div>
                  {new Date().toLocaleString(undefined, { hour12: true })}
                </div>
              </div>
              <hr className="my-2" />
              <div>
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="py-1 w-1/12 text-center">#</th>
                      <th className="py-1 text-left">Item</th>
                      <th className="py-1 w-2/12 text-center">Cant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ejemploDeCarrito.map((item: any, index: any) => (
                      <tr key={index}>
                        <td className="py-2 text-center">{index + 1}</td>
                        <td className="py-2 text-left">
                          <span>{item.name}</span>
                          <br />
                          <small>Nota: Sin queso, adicionar galleta</small>
                          <br />
                          <small>Sabores: Chocolate, Mandarina</small>
                        </td>
                        <td className="py-2 text-center">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <hr className="my-2" />
            </div>
            <div className="p-4 w-full hide-print">
              <div className="items-center mb-6 ml-2 justify-end flex">
                <label htmlFor="exampleCheckbox" className="mr-2 text-gray-700">
                  Es un Domicilio?
                </label>
                <input
                  type="checkbox"
                  id="exampleCheckbox"
                  className="form-checkbox h-5 w-6 text-blue-500 focus:ring-blue-300 border-gray-300 rounded-md"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </div>
              <button
                className="bg-cyan-500 text-white text-lg px-4 py-3 rounded-2xl w-full focus:outline-none"
                onClick={() => printAndProceed()}
              >
                IMPRIMIR
              </button>
            </div>
          </div>
        </Modal>

        {/* {end No print area} */}

        <div id="print-area" className="print-area"></div>
      </div>
    </>
  );
}

export default App;
