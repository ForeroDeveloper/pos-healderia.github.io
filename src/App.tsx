/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import Cart from './Components/Cart/Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faHouse,
  faDeleteLeft,
  faRightToBracket,
  faUtensils,
  faBox,
  faIceCream,
  faMagnifyingGlass,
  faMoneyBill,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Modal from './Components/Modal/Modal';
import TableOrders from './Components/TableOrders/TableOrders';
import CsvUploader from './Components/CsvUploader/CsvUploader';
import TableInventory from './Components/TableInventory/TableInventory';
import { useProductContext } from './context/ProductContext/ProductContext';
// @ts-expect-error
import { v4 as uuidv4 } from 'uuid';
import { ref, set, push, onValue, remove, update } from 'firebase/database';
// @ts-expect-error
import { db, realtimeDb } from '../src/config/firestore.js';
import ImageComponent from './Components/ImageComponent/ImageComponent.js';
import { isMobile, isDesktop } from 'react-device-detect';

declare global {
  interface Window {
    Toaster: any;
  }
}

const OnScreenKeyboard = ({ onKeyPress }: any) => {
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Del'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ', 'Enter'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '!', '?', ';', '.'],
    ['Espacio'],
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
                className={`m-1 p-2 bg-gray-300 rounded ${key === 'Espacio' ? 'w-[50%] mx-auto' : 'w-[5.2rem]'} h-10`}
              >
                {key === 'Del' ? (
                  <span>
                    <FontAwesomeIcon icon={faDeleteLeft} color="red" />
                  </span>
                ) : key === 'Enter' ? (
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
  // const [inputValue, setInputValue] = useState("");
  const [productSelected, setProductSelected] = useState<any>({});
  const [valueInPayment, setValueInPayment] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phoneClient, setPhoneClient] = useState<string>('');
  // const [valueInProduct, setValueInProduct] = useState<string>("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openModalFlavors, setOpenModalFlavors] = useState(false);
  const [modalCockIsOpen, setModalCockIsOpen] = useState(false);
  const [pageView, setPageView] = useState('sales');
  const [isPaymentView, setIsPaymentView] = useState(false);
  const [categorySelected, setCategorySelected] = useState<string>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  // const [productsBySearch, setProductsBySearch] = useState<any[]>([]);
  const [flavorsList, setFlavorsList] = useState<any[]>([]);

  const {
    productList,
    addProductOrder,
    productsInOrder,
    updateProductOrder,
    categoriesList,
    setProductsInOrder,
    orderSelected,
    setOrderSelected,
    setIsEditOrder,
    isEditOrder,
    setProductsInOrderByDbHandler,
    setFlavorsList: setFlavorsInContext,
    isModalOpen,
    setIsModalOpen,
  } = useProductContext();

  const [isChecked, setIsChecked] = useState(false);
  const inputRef = useRef<any | null>(null);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const openModal = () => {
    if (orderSelected?.orderStatus == 'PAID') {
      return;
    }
    setModalIsOpen(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsModalOpen(false);
    setValueInPayment('');
  };

  const buttonsData = [
    { id: 1, label: '1', value: 1 },
    { id: 2, label: '2', value: 2 },
    { id: 3, label: '3', value: 3 },
    { id: 15, label: '<--', value: 'borrar' },
    { id: 4, label: '4', value: 4 },
    { id: 5, label: '5', value: 5 },
    { id: 6, label: '6', value: 6 },
    { id: 11, label: '%Des', value: 'descuento' },
    { id: 7, label: '7', value: 7 },
    { id: 8, label: '8', value: 8 },
    { id: 9, label: '9', value: 9 },
    { id: 12, label: 'Prec', value: 'precio' },
    { id: 13, label: '+/-', value: 'restar' },
    { id: 0, label: '0', value: 0 },
    { id: 14, label: ',', value: ',' },
    { id: 10, label: 'Can', value: 'cantidad' },
  ];
  const buttonsDataModal = [
    { id: 1, label: '1', value: 1 },
    { id: 2, label: '2', value: 2 },
    { id: 3, label: '3', value: 3 },
    { id: 11, label: '+500', value: 500 },
    { id: 4, label: '4', value: 4 },
    { id: 5, label: '5', value: 5 },
    { id: 6, label: '6', value: 6 },
    { id: 12, label: '+1.000', value: 1000 },
    { id: 7, label: '7', value: 7 },
    { id: 8, label: '8', value: 8 },
    { id: 9, label: '9', value: 9 },
    { id: 10, label: '+5.000', value: 5000 },

    { id: 13, label: '', value: 'no-action' },
    { id: 0, label: '0', value: 0 },
    { id: 14, label: '', value: 'no-action' },
    { id: 15, label: '<--', value: 'borrar' },
  ];

  const ordersStatus = [
    { id: 3, label: 'En Cocina', value: 3 },
    { id: 2, label: 'Finalizadas', value: 2 },
    { id: 1, label: 'Canceladas', value: 1 },
  ];

  const handleKeyPress = (key: any) => {
    if (key === 'Del') {
      setSearchTerm((prev) => prev.slice(0, -1));
    } else if (key == 'Espacio') {
      setSearchTerm((prev) => prev + ' ');
    } else if (key == 'Enter') {
      setSearchTerm('');
      setShowKeyboard(false);
    } else {
      setSearchTerm((prev) => prev + key);
    }
  };

  const handleCreateOrder = (isPayment: boolean = false): void => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    try {
      const ordersRef = ref(realtimeDb, `orders/${formattedDate}`);
      const newOrderRef = push(ordersRef);
      const newOrderKEy = newOrderRef.key;
      const deliveryCost = isChecked ? 1500 : 0;

      const newOrderToDb = {
        id: newOrderKEy,
        orderId: Object.keys(orderByDb).length + 1,
        products: productsInOrder.map((product) => ({
          ...product,
          initialQuantity: product.quantity,
        })),
        total: Number(calculateTotal() + deliveryCost),
        isDelivery: isChecked,
        orderStatus: isPayment ? 'PAID' : 'PENDING',
        date: new Date().toLocaleString(undefined, { hour12: true }),
        addressClient: address,
        phoneClient,
        isPrint: false,
      };
      set(newOrderRef, newOrderToDb);
      setValueInPayment('');
      setIsChecked(false);
      setAddress('');
      setPhoneClient('');
      console.log('Datos registrados en Realtime Database');
    } catch (error) {
      console.error('Error al registrar en Realtime Database:', error);
    }
  };

  const handleCreateAndCleanOrder = (isPaid: boolean = false): void => {
    handleCreateOrder(isPaid);
    setProductsInOrder([]);
    setProductSelected(null);
    setModalCockIsOpen(false);
  };

  const printAndProceed = () => {
    if (isDesktop) {
      window.print();
    } else {
      const totalCalculated = calculateTotal();

      let productsInOrder2 = productsInOrder.map((product) => {
        if (product?.notes) {
          const updatedNotes = Object?.values(product.notes || [])
            .map((note: any) => (note !== '' ? `P${note.id}: ${note.note}` : ''))
            .join(', ');
          return { ...product, notes: updatedNotes };
        } else {
          return product;
        }
      });

      const deliveryCost = isChecked ? 1500 : 0;

      let arrayDataText = JSON.stringify({
        products: productsInOrder2,
        isDelivery: isChecked,
        total: Number(totalCalculated + deliveryCost),
        date: new Date().toLocaleString(undefined, { hour12: true }),
        address,
        phoneClient,
        orderId: Object.keys(orderByDb).length + 1,
      });

      if (!orderSelected) {
        handleCreateAndCleanOrder();
      } else {
        updateOrderSelected(false);
      }

      console.log(arrayDataText);
      console.log(`${arrayDataText}`);

      window?.Toaster?.postMessage(`${arrayDataText}`);
      setValueInPayment('');
    }
  };

  useEffect(() => {
    if (productsInOrder?.length > 0 && productsInOrder?.findIndex((products) => products?.id === productSelected?.id) === -1) {
      setProductSelected(productsInOrder[productsInOrder.length - 1]);
    }
  }, [productSelected, productsInOrder]);

  const calculateTotal = () => {
    const total = productsInOrder.reduce((acumulador, producto) => {
      return acumulador + producto.price * producto.quantity;
    }, 0);
    return total;
  };

  const handleChangeCategory = (category: string) => {
    setCategorySelected(category);
  };

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      const productNameLowerCase = product.name.toLowerCase();
      const searchTermLowerCase = searchTerm.toLowerCase();

      const nameFilter = productNameLowerCase.includes(searchTermLowerCase);

      const categoryFilter = !categorySelected || product.category === categorySelected;

      return searchTerm.length > 0 ? nameFilter : categoryFilter;
    });
  }, [searchTerm, categorySelected, productList]);

  const [inputFlavors, setInputFlavors] = useState('');

  const handleInputChange = (e: any) => {
    setInputFlavors(e.target.value);
  };

  const handleSave = () => {
    try {
      const flavorRef = ref(realtimeDb, `flavors/`);
      const newFlavorRef = push(flavorRef);
      const newOrderKEy = newFlavorRef.key;
      const newFlavor = {
        id: newOrderKEy,
        name: inputFlavors,
      };
      set(newFlavorRef, newFlavor);
      setFlavorsList((prev) => [...prev, newFlavor]);
      setFlavorsInContext([...flavorsList, newFlavor]);
      setInputFlavors('');
      console.log('Datos registrados en Realtime Database');
    } catch (error) {
      console.error('Error al registrar en Realtime Database:', error);
    }
  };
  const handleDelete = (id: string) => {
    try {
      const flavorRef = ref(realtimeDb, `flavors/${id}`);
      remove(flavorRef);
      setFlavorsList((prev) => prev.filter((flavor) => flavor.id !== id));
    } catch (error) {
      console.error('Error al eliminar en Realtime Database:', error);
    }
  };
  const handleDeleteOrder = (id: string) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    try {
      const orderRef = ref(realtimeDb, `orders/${formattedDate}/${id}`);
      remove(orderRef);
      if (orderByDb.length === 1) {
        setOrdersByDb([]);
        setOrderSelected(null);
      }
      setOrderSelected(null);
    } catch (error) {
      console.error('Error al eliminar en Realtime Database:', error);
    }
  };

  useEffect(() => {
    const starCountRef = ref(realtimeDb, 'flavors/');
    onValue(
      starCountRef,
      (snapshot) => {
        const data = snapshot.val();
        const flavors = Object.keys(data).map((productId) => ({
          id: productId,
          ...data[productId],
        }));
        setFlavorsList(flavors);
        setFlavorsInContext(flavors);
      },
      { onlyOnce: true },
    );
  }, []);
  const [orderByDb, setOrdersByDb] = useState<any[]>([]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const starCountRef = ref(realtimeDb, `orders/${formattedDate}`);
    onValue(
      starCountRef,
      (snapshot) => {
        const data = snapshot.val();
        const orders = Object.keys(data || []).map((productId) => ({
          id: productId,
          ...data[productId],
        }));
        setOrdersByDb(orders);
      },
      { onlyOnce: false },
    );
  }, []);

  const calculateTotalUpdate = (productsMap: any[]) => {
    const total = productsMap.reduce((acumulador, producto) => {
      return acumulador + producto.price * producto.quantity;
    }, 0);
    return total;
  };

  const updateOrderSelected = async (isPaid: boolean = true) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const productRef = ref(realtimeDb, `orders/${formattedDate}/${orderSelected?.id}`);
    try {
      const productsMap = productsInOrder?.length ? productsInOrder : orderSelected?.products;

      const deliveryCost = isChecked ? 1500 : 0;

      if (productsInOrder?.length || orderSelected?.products) {
        await update(productRef, {
          products: productsMap.map((product: any) => ({
            ...product,
            quantity: product?.quantity,
            initialQuantity: product?.quantity,
          })),
          orderStatus: isPaid ? 'PAID' : 'PENDING',
          addressClient: address,
          phoneClient,
          total: Number(calculateTotalUpdate(productsMap) + deliveryCost),
        });
      } else {
        await remove(productRef);
      }
      setProductsInOrder([]);
      setOrderSelected(null);
      setProductSelected(null);
      setModalCockIsOpen(false);

      console.log('Producto actualizado correctamente en Realtime Database');
    } catch (error) {
      console.error('Error al actualizar el producto en Realtime Database:', error);
    }
  };

  const [isFocused, setIsFocused] = useState(false);

  const handleButtonClick = () => {
    if (isFocused) {
      inputRef.current.blur();
    } else {
      inputRef.current.focus();
      setSearchTerm('');
    }
    setIsFocused(!isFocused);
  };

  const handleKeyPressEvent = (event: any) => {
    if (event.key === 'Enter') {
      if (modalIsOpen) {
        setIsChecked(false);
        if (orderSelected) {
          updateOrderSelected();
          setModalIsOpen(false);
          setIsModalOpen(false);
          return;
        }
        handleCreateAndCleanOrder(true);
        setModalIsOpen(false);
        setIsModalOpen(false);
        return;
      }
      openModal();
      return;
    }

    if (event.keyCode >= 112 && event.keyCode <= 120 && !isModalOpen) {
      const keyValue = Number(event.key.match(/\d+/)[0]);
      inputRef.current.blur();
      if (filteredProducts[keyValue - 1]) {
        addProductOrder(filteredProducts[keyValue - 1]);
        setProductSelected(filteredProducts[keyValue - 1]);
      }
      return;
    }

    if (event.keyCode >= 65 && event.keyCode <= 90 && !isModalOpen) {
      inputRef.current.focus();
      return;
    }

    if (event.keyCode === 8 || event.keyCode === 46) {
      if (!isModalOpen) {
        // Tecla de retroceso o suprimir
        inputRef.current.focus();
      }
      return;
    }

    // if (event.keyCode >= 112 && event.KeyCode <= 120) {
    // 112 es el código de tecla para la tecla F1
    //   inputRef.current.focus();
    // } else if (event.keyCode === 113) {
    // 113 es el código de tecla para la tecla F2
    //   setPageView((prevPageView) => (prevPageView === 'sales' ? 'orders' : 'sales'));
    // }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPressEvent);
    // Limpiar el listener al desmontar el componente
    return () => {
      document.removeEventListener('keydown', handleKeyPressEvent);
    };
  }, [isModalOpen, filteredProducts, productList, productSelected]);

  // const handleAfterPrint = () => {

  // };

  // useEffect(() => {
  //   window.addEventListener('afterprint', handleAfterPrint);
  //   return () => {
  //     window.removeEventListener('afterprint', handleAfterPrint);
  //   };
  // }, []);

  return (
    <>
      <div className="h-screen">
        {/* {Header con opciones} */}
        {isDesktop && (
          <div className="w-full bg-cyan-800 h-11 py-2 pr-1 flex justify-end">
            <button
              className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md mr-3"
              onClick={() => {
                setOpenModalFlavors(true);
                setIsModalOpen(true);
              }}
            >
              Sabores de Helado <FontAwesomeIcon icon={faIceCream} />
            </button>
            <button
              className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md mr-3"
              onClick={() => setPageView('inventory')}
            >
              Inventario <FontAwesomeIcon icon={faBox} />
            </button>
            <button
              className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md"
              onClick={() => setPageView('orders')}
            >
              Ordenes <FontAwesomeIcon icon={faUtensils} />
            </button>
            <button
              className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md ml-3"
              onClick={() => {
                setPageView('sales');
                setOrderSelected(null);
              }}
            >
              Realizar venta <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
        )}
        {/* {isDesktop ||
          (isTablet && (
            <div className="w-full bg-cyan-800 h-11 py-2 pr-1 flex justify-end">
              <button
                className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md mr-3"
                onClick={() => setOpenModalFlavors(true)}
              >
                Sabores de Helado <FontAwesomeIcon icon={faIceCream} />
              </button>
              <button
                className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md mr-3"
                onClick={() => setPageView('inventory')}
              >
                Inventario <FontAwesomeIcon icon={faBox} />
              </button>
              <button
                className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md"
                onClick={() => setPageView('orders')}
              >
                Ordenes <FontAwesomeIcon icon={faUtensils} />
              </button>
              <button
                className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md ml-3"
                onClick={() => {
                  setPageView('sales');
                  setOrderSelected(null);
                }}
              >
                Realizar venta <FontAwesomeIcon icon={faCartShopping} />
              </button>
            </div>
          ))} */}
        {isMobile && (
          <div className="w-full bg-cyan-800 h-11 py-2 pr-1 flex justify-end">
            <button
              className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md mr-3"
              onClick={() => {
                setOpenModalFlavors(true);
                setIsModalOpen(true);
              }}
            >
              Sabores <FontAwesomeIcon icon={faIceCream} />
            </button>

            <button
              className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md"
              onClick={() => setPageView('orders')}
            >
              Ordenes <FontAwesomeIcon icon={faUtensils} />
            </button>
            <button
              className="text-white text-sm font-semibold w-auto h-full pl-2 pr-2 bg-orange-400 rounded-md ml-3"
              onClick={() => {
                setPageView('sales');
                setOrderSelected(null);
              }}
            >
              Venta <FontAwesomeIcon icon={faCartShopping} />
            </button>
          </div>
        )}

        {/* {Modulo de venta} */}
        {isDesktop && (
          <div className={`${pageView === 'sales' ? 'flex h-screen' : 'hidden'}`}>
            {/* Left Bar */}
            <div className="lg:w-[40%]">
              <div className="bg-white flex flex-col h-full shadow text-blue-gray-800">
                <div className="flex-1 flex flex-col overflow-auto">
                  {productsInOrder.length ? (
                    <div className="flex-1 w-full overflow-auto border-t-2">
                      <Cart cart={productsInOrder} productSelected={productSelected} />
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
                      <div className="text-right w-full font-bold">${new Intl.NumberFormat().format(calculateTotal())}</div>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex flex-col h-full w-2/5">
                      <div className="h-auto">
                        <button
                          className="text-white text-lg w-full h-full py-3 focus:outline-none bg-gray-500 hover:bg-gray-600"
                          // onClick={() => window.print()}
                          onClick={() => {
                            setModalCockIsOpen(!modalCockIsOpen);
                            setIsModalOpen(true);
                          }}
                        >
                          M. Cocina <FontAwesomeIcon icon={faUtensils} />
                        </button>
                      </div>
                      <div className="h-auto">
                        <button
                          className="text-gray text-lg w-full h-full py-3 focus:outline-none bg-yellow-300 hover:bg-yellow-400"
                          onClick={() => {
                            if (isChecked) {
                              setIsChecked(false);
                            }
                            if (productsInOrder?.length && !orderSelected) {
                              handleCreateAndCleanOrder();
                            } else {
                              updateOrderSelected(false); //TODO: cuadno es uan orden creda anterioirmente
                            }
                            setIsEditOrder(false);
                            setIsChecked(false);
                          }}
                        >
                          Pendiente
                          <FontAwesomeIcon icon={faMoneyBill} color="black" className="ml-2" />
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
                            if (number.value === 'borrar') {
                              updateProductOrder(productSelected.id, productSelected);
                            } else if (!isNaN(number.value as number)) {
                              addProductOrder(productSelected, number.value as unknown as number);
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
              <div className="w-full bg-cyan-400 h-12 p-2 flex items-center overflow-hidden sticky top-0 z-50">
                <div className="flex w-full items-center">
                  <FontAwesomeIcon
                    icon={faHouse}
                    size="2x"
                    onClick={() => {
                      handleChangeCategory('');
                      setSearchTerm('');
                    }}
                    className="cursor-pointer"
                  />

                  <div className="flex w-full items-center overflow-x-auto">
                    {/* Mostrar las categorías */}
                    {categoriesList.map((categoria, index) => (
                      <button
                        className="text-sm font-semibold ml-3 hover:bg-cyan-300 bg-none rounded truncate p-[0.3rem]"
                        onClick={() => {
                          handleChangeCategory(categoria);
                          setSearchTerm('');
                        }}
                        key={index + 1}
                      >
                        {categoria}
                      </button>
                    ))}
                  </div>

                  {/* Mostrar el buscador */}
                  <div className="flex-shrink-0 w-1/4 ml-auto">
                    <button className="text-sm font-semibold bg-white shadow rounded-3xl truncate w-full h-9 flex">
                      <div className="rounded-full bg-cyan-500 text-white w-6 left-2 relative mt-2">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </div>
                      {isDesktop ? (
                        <input
                          type="text"
                          ref={inputRef}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full mr-2 text-left bg-none px-2 focus:outline-none text-gray-800 mt-2 ml-1 truncate"
                          placeholder="Buscar producto..."
                        />
                      ) : (
                        <input
                          type="text"
                          value={searchTerm}
                          readOnly
                          onClick={() => setShowKeyboard(!showKeyboard)}
                          className="w-full mr-2 text-left bg-none px-2 focus:outline-none text-gray-800 mt-2 ml-1 truncate"
                          placeholder="Buscar producto..."
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* {LISTA DE PRODUCTOS} */}
              <div className="grid grid-cols-4 gap-2 pb-2 text-gray-700 p-2">
                {filteredProducts.map((producto) => {
                  const productInOrder = productsInOrder.find((product) => product.id === producto.id);
                  return (
                    <div
                      key={producto.id}
                      role="button"
                      onClick={() => {
                        addProductOrder(producto);
                        setProductSelected(producto);
                      }}
                      className="cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg relative flex flex-col"
                    >
                      {productInOrder && (
                        <span className="bg-blue-400 text-zinc-50 py-1 px-2 rounded-full text-xs absolute top-0 right-4 mt-2 -mr-1 font-bold">
                          {productInOrder.quantity}
                        </span>
                      )}
                      <ImageComponent src={producto.image} />
                      <div className="flex flex-col pb-3 px-3 text-sm justify-start text-left">
                        <p className="flex-grow mr-1">{producto.name}</p>
                        <p className="nowrap font-bold text-cyan-500">$ {new Intl.NumberFormat().format(producto.price)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {showKeyboard && <OnScreenKeyboard onKeyPress={handleKeyPress} />}
            </div>
          </div>
        )}

        {/* {Fin Modulo de venta} */}

        {/* {Modulo de venta desde Mobile} */}
        {isMobile && (
          <div className={`${pageView === 'sales' ? 'flex h-screen' : 'hidden'}`}>
            {/* Left Bar */}
            {!isPaymentView ? (
              <div className="w-full">
                <div className="bg-white flex flex-col h-full shadow text-blue-gray-800">
                  <div className="flex flex-col overflow-auto">
                    <div className="overflow-y-auto">
                      <div className="w-full bg-cyan-400 h-12 p-2 flex items-center overflow-hidden sticky top-0 text-white">
                        <div className="flex w-full items-center custom-scrollbar overflow-auto">
                          <FontAwesomeIcon
                            icon={faHouse}
                            size="2x"
                            onClick={() => {
                              handleChangeCategory('');
                              setSearchTerm('');
                            }}
                            className="cursor-pointer"
                          />

                          <div className="flex items-center">
                            <div className="flex whitespace-nowrap overflow-x-auto">
                              {categoriesList.map((categoria, index) => (
                                <button
                                  className="text-sm font-semibold truncate hover:bg-cyan-300 bg-none rounded px-2 mr-2"
                                  onClick={() => handleChangeCategory(categoria)}
                                  key={index}
                                >
                                  {categoria}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 w-full overflow-auto border-t-2 flex-col mb-[120px]">
                      <div className="grid grid-cols-3 gap-2 pb-2 text-gray-700 p-2">
                        {filteredProducts.map((producto) => {
                          const productInOrder = productsInOrder.find((product) => product.id === producto.id);
                          return (
                            <div
                              key={producto.id}
                              role="button"
                              onClick={() => {
                                addProductOrder(producto);
                                setProductSelected(producto);
                              }}
                              className="cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg relative flex flex-col"
                            >
                              {productInOrder && (
                                <span className="bg-blue-400 text-zinc-50 py-1 px-2 rounded-full text-xs absolute top-0 right-4 mt-2 -mr-1 font-bold">
                                  {productInOrder.quantity}
                                </span>
                              )}
                              <ImageComponent src={producto.image} />
                              <div className="flex flex-col pb-3 px-3 text-sm justify-start text-left">
                                <p className="flex-grow mr-1">{producto.name}</p>
                                <p className="nowrap font-bold text-cyan-500">$ {new Intl.NumberFormat().format(producto.price)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex fixed bottom-0 left-0 w-full flex-col bg-white">
                      <div className="h-auto w-full text-center pb-1 px-4 ">
                        <div className="flex text-lg font-semibold text-blue-gray-700">
                          <input
                            type="text"
                            ref={inputRef}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full mr-2 text-left bg-none focus:outline-none text-gray-800 mt-2"
                            placeholder="Buscar producto..."
                          />
                        </div>
                      </div>

                      <div className="h-auto w-full text-center pb-1 px-4">
                        <div className="flex text-lg font-semibold text-blue-gray-700">
                          <div>TOTAL</div>
                          <div className="text-right w-full font-bold">${new Intl.NumberFormat().format(calculateTotal())}</div>
                        </div>
                      </div>
                      <div className="flex flex-col h-full w-full">
                        <div className="h-auto flex">
                          <button
                            className="text-white font-bold text-lg h-full py-3 focus:outline-none bg-cyan-500 hover:bg-cyan-600 w-3/4"
                            onClick={() => setIsPaymentView(true)}
                          >
                            Pago
                          </button>
                          <button
                            className="text-white font-bold text-lg w-1/4 h-full py-3 focus:outline-none bg-violet-400 hover:bg-violet-600"
                            onClick={() => handleButtonClick()}
                          >
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-white flex flex-col h-full shadow text-blue-gray-800">
                  <div className="flex-1 flex flex-col overflow-auto">
                    {productsInOrder.length ? (
                      <div className="flex-1 w-full overflow-auto border-t-2">
                        <Cart cart={productsInOrder} setProduct={setProductSelected} productSelected={productSelected} />
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

                    <div
                      className="h-auto w-20 text-center p-1 bg-cyan-500 rounded-r-xl shadow-lg mb-1"
                      onClick={() => setIsPaymentView(false)}
                    >
                      <div className="text-sm font-semibold text-white">
                        <div>Volver</div>
                      </div>
                    </div>

                    <div className="h-auto w-full text-center pb-1 px-4">
                      <div className="flex text-lg font-semibold text-blue-gray-700">
                        <div>TOTAL</div>
                        <div className="text-right w-full font-bold">${new Intl.NumberFormat().format(calculateTotal())}</div>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="flex flex-col h-full w-2/5">
                        <div className="h-auto">
                          <button
                            className="text-white text-lg w-full h-full py-3 focus:outline-none bg-gray-500 hover:bg-gray-600"
                            onClick={() => setModalCockIsOpen(!modalCockIsOpen)}
                          >
                            M. Cocina <FontAwesomeIcon icon={faUtensils} />
                          </button>
                        </div>
                        <div className="h-auto">
                          <button
                            className="text-gray text-lg w-full h-full py-3 focus:outline-none bg-yellow-300 hover:bg-yellow-400"
                            onClick={() => {
                              if (productsInOrder?.length && !orderSelected) {
                                handleCreateAndCleanOrder();
                              } else {
                                updateOrderSelected(false); //TODO: cuadno es uan orden creda anterioirmente
                              }
                              setIsEditOrder(false);
                              setIsChecked(false);
                            }}
                          >
                            Pendiente
                            <FontAwesomeIcon icon={faMoneyBill} color="black" className="ml-2" />
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
                              if (number.value === 'borrar') {
                                updateProductOrder(productSelected.id, productSelected);
                              } else if (
                                typeof number.value === 'number' &&
                                (number.value as number) > 0 &&
                                (number.value as number) < 10
                              ) {
                                addProductOrder(productSelected, number.value);
                                // handleChageQuantityProduct(number);
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
            )}
          </div>
        )}

        {/* {Modulo de lista de ordenes} */}
        <div className={`${pageView === 'orders' ? 'flex h-screen' : 'hidden'} text-white`}>
          {/* {Contenedor de las ordenes} */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full bg-cyan-400 h-12 p-2 flex items-center overflow-hidden sticky top-0">
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
                      value={searchTerm}
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
            <TableOrders orders={orderByDb} />

            {showKeyboard && <OnScreenKeyboard onKeyPress={handleKeyPress} />}
          </div>
          {/* Right Bar */}
          <div className="w-2/5">
            <div className="bg-white flex flex-col h-full shadow text-blue-gray-800">
              <div className="flex-1 flex flex-col overflow-auto">
                {orderSelected ? (
                  <div className="flex-1 w-full overflow-auto">
                    <Cart cart={orderSelected?.products || []} isCreated={true} />
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
                    <p>Seleccione Una Orden</p>
                  </div>
                )}

                <div className="h-auto w-full text-center pb-1 px-4">
                  <div className="flex text-lg font-semibold text-blue-gray-700">
                    <div>TOTAL</div>
                    <div className="text-right w-full">
                      ${new Intl.NumberFormat().format(calculateTotal() || orderSelected?.total || 0)}
                    </div>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col h-full w-full">
                    {orderSelected && (
                      <div className="h-auto justify-between flex">
                        <button
                          className="text-white text-lg w-full h-full py-3 focus:outline-none bg-gray-500 hover:bg-gray-600"
                          onClick={() => {
                            if (orderSelected?.orderStatus === 'PAID') {
                              return;
                            }
                            setProductsInOrderByDbHandler(orderSelected?.products);
                            setIsChecked(orderSelected?.isDelivery);
                            setAddress(orderSelected?.addressClient);
                            setPhoneClient(orderSelected?.phoneClient);
                            setIsEditOrder(true);
                            setPageView('sales');
                          }}
                        >
                          Editar Orden <FontAwesomeIcon icon={faUtensils} />
                        </button>
                        <button
                          className="text-white text-lg w-full h-full py-3 focus:outline-none bg-red-500 hover:bg-red-600"
                          onClick={() => {
                            handleDeleteOrder(orderSelected?.id);
                          }}
                        >
                          Eliminar <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                    <div className="flex-grow">
                      <button
                        className="text-white text-lg w-full h-[80px] py-3 focus:outline-none bg-cyan-500 hover:bg-cyan-600 font-semibold"
                        onClick={() => {
                          if (!orderSelected) {
                            return;
                          }
                          openModal();
                        }}
                      >
                        {orderSelected?.orderStatus === 'PAID' ? 'YA SE PAGO' : 'Pagar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {Modulo de Inventario} */}
        <div className={`${pageView === 'inventory' ? 'flex h-screen' : 'hidden'}`}>
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
          <div className="w-[85vw] h-auto text-gray-700 max-w-[100%]">
            <div className="flex w-full">
              <span className="mr-2">Valor Ingresado</span>
              <span className="text-red-500 font-bold">${new Intl.NumberFormat().format(Number(valueInPayment))}</span>
            </div>
            <div className="w-full flex font-normal text-gray-500">
              <span className="mr-2">Total Venta</span>
              <span
                className={`${
                  Number(valueInPayment) >= (!!orderSelected ? orderSelected?.total : calculateTotal())
                    ? 'text-green-600 font-semibold'
                    : 'text-gray-500'
                }`}
              >
                $
                {isChecked
                  ? new Intl.NumberFormat().format((calculateTotal() || orderSelected?.total) + 1500)
                  : new Intl.NumberFormat().format(calculateTotal() || orderSelected?.total)}
              </span>
            </div>
            <div className="items-left justify-left flex cursor-pointer mt-2">
              <input
                type="checkbox"
                id="exampleCheckbox"
                className="form-checkbox h-5 w-6 text-blue-500 focus:ring-blue-300 border-gray-300 rounded-md"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="exampleCheckbox" className="ml-2 text-gray-700 font-medium cursor-pointer">
                Es un Domicilio?
              </label>
            </div>
            {/* <h2 className="text-lg font-bold mb-2">Realizar Pago</h2> */}
            <div className="w-full overflow-auto p-2">
              <div className="flex text-lg font-semibold text-blue-gray-700">
                <div className="text-right w-full">
                  <span className="mr-2">Cambio</span>
                  <span className="text-blue-500">
                    $
                    {new Intl.NumberFormat().format(
                      Number(valueInPayment) > (isChecked ? calculateTotal() + 1500 : calculateTotal() || orderSelected?.total)
                        ? Number(valueInPayment) - (isChecked ? calculateTotal() + 1500 : calculateTotal() || orderSelected?.total)
                        : 0,
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
                    if (number.value === 'borrar') {
                      setValueInPayment((prevValue) => prevValue.slice(0, -1));
                      return;
                    }
                    if (number.label.includes('+')) {
                      setValueInPayment((prevValue) => {
                        const newValue = Number(prevValue) + Number(number.value);
                        return newValue.toString();
                      });
                      return;
                    }
                    if (number.value === 'no-action') {
                      return;
                    }
                    setValueInPayment((prevValue) => {
                      return prevValue + number.value.toString();
                    });
                  }}
                  className="bg-white text-gray p-3 hover:bg-gray-200 focus:outline-none border border-solid border-gray-400 h-[70px]"
                >
                  {number.label === '<--' ? <FontAwesomeIcon icon={faDeleteLeft} color="red" fontSize={22} /> : number.label}
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
              <button
                className="text-white text-lg w-full h-[65px] py-3 focus:outline-none bg-green-400 hover:bg-green-500 rounded-md"
                onClick={() => {
                  setIsChecked(false);
                  if (orderSelected) {
                    updateOrderSelected();
                    setModalIsOpen(false);
                    setIsModalOpen(false);
                    return;
                  }
                  handleCreateAndCleanOrder(true);
                  setModalIsOpen(false);
                  setIsModalOpen(false);
                  setIsChecked(false);
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </Modal>

        {/* {REcibo MOdal} */}
        <Modal
          isOpen={modalCockIsOpen}
          onClose={() => {
            setModalCockIsOpen(!modalCockIsOpen);
            setIsModalOpen(false);
          }}
        >
          <div className="w-96 bg-white overflow-x-auto z-10 text-gray-500 h-auto max-h-[80vh]">
            <div className="text-left w-full text-sm p-4 overflow-auto">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Mandar a Cocina</h2>
              </div>
              <div className="flex mt-4 text-xs"></div>
              <div className="flex justify-center text-center flex-col">
                <div className="text-md">{new Date().toLocaleString(undefined, { hour12: true })}</div>
                <div className=" text-xs">
                  Dirección: <strong>{address.toUpperCase() || 'Sin Especificar'}</strong>
                </div>
                <div className=" text-xs mb-2">
                  Celular: <strong>{phoneClient || 'Sin Especificar'}</strong>
                </div>
                <hr className="my-2" />
              </div>
              {/* <div className="flex-grow">
                  No. de items:{' '}
                  {isEditOrder
                    ? productsInOrder.filter((producto) => producto.quantity !== producto.initialQuantity).length
                    : productsInOrder.length}
                </div> */}
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
                    {isEditOrder && orderSelected?.isPrint
                      ? productsInOrder
                          .filter((producto) => producto.quantity !== producto.initialQuantity)
                          .map((item: any, index: any) => (
                            <tr key={index}>
                              <td className="py-2 text-center">{index + 1}</td>
                              <td className="py-2 text-left">
                                <span>{item.name}</span>
                                <br />
                                {Object.values(item?.notes || []).map((note: any, index) => (
                                  <small>
                                    {' '}
                                    <b>{index + 1}:</b> {note.note},{' '}
                                  </small>
                                ))}
                              </td>
                              <td className="py-2 text-center">
                                {item?.initialQuantity ? item.quantity - item?.initialQuantity : item.quantity}
                              </td>
                            </tr>
                          ))
                      : productsInOrder.map((item: any, index: any) => (
                          <tr key={index}>
                            <td className="py-2 text-center">{index + 1}</td>
                            <td className="py-2 text-left">
                              <span>{item.name}</span>
                              <br />
                              {Object.values(item?.notes || []).map((note: any, index) => (
                                <small>
                                  {' '}
                                  <b>{index + 1}:</b> {note.note},{' '}
                                </small>
                              ))}
                            </td>
                            <td className="py-2 text-center">{item.quantity}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
              <hr className="my-2" />
              <div className="w-full justify-end flex">
                <span className="font-semibold text-right">SubTotal: ${new Intl.NumberFormat().format(calculateTotal())}</span>
              </div>
              {isChecked && (
                <div className="w-full justify-end flex">
                  <span className="font-semibold text-right">Domicilio: ${new Intl.NumberFormat().format(1500)}</span>
                </div>
              )}
              <div className="w-full justify-end flex">
                <span className="font-bold text-right text-[0.8rem]">
                  TOTAL: $
                  {isChecked ? new Intl.NumberFormat().format(calculateTotal() + 1500) : new Intl.NumberFormat().format(calculateTotal())}
                </span>
              </div>
            </div>
            <div className="p-4 w-full hide-print">
              <div className="items-center mb-4 ml-2 justify-center flex cursor-pointer">
                <input
                  type="checkbox"
                  id="exampleCheckbox"
                  className="form-checkbox h-5 w-6 text-blue-500 focus:ring-blue-300 border-gray-300 rounded-md"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="exampleCheckbox" className="ml-2 text-gray-700 font-medium cursor-pointer">
                  Es un Domicilio?
                </label>
              </div>
              {isChecked && (
                <div className="mb-4">
                  <span className="text-sm font-normal flex justify-left ml-2">Direccion:</span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="off"
                    className="w-full h-10 mr-2 text-left bg-none px-2 focus:outline-gray-800 text-gray-800 mt-2 ml-1 border border-gray-500 rounded-md"
                    placeholder="Ingresa la direccion del cliente..."
                  />
                  <span className="text-sm font-normal flex justify-left ml-2 mt-2">Celular:</span>
                  <input
                    type="text"
                    value={phoneClient}
                    onChange={(e) => setPhoneClient(e.target.value)}
                    autoComplete="off"
                    className="w-full h-10 mr-2 text-left bg-none px-2 focus:outline-gray-800 text-gray-800 mt-2 ml-1 border border-gray-500 rounded-md"
                    placeholder="Para llamar al cliente..."
                  />
                </div>
              )}
              <button
                className="bg-cyan-500 text-white text-lg px-4 py-3 rounded-2xl w-full focus:outline-none"
                onClick={() => {
                  const haveItemsByDb = productsInOrder.filter((producto) => producto.quantity !== producto.initialQuantity).length;
                  const haveItems = productsInOrder.length;
                  if (haveItemsByDb || orderSelected?.isPrint || haveItems) {
                    printAndProceed();
                  }
                }}
              >
                IMPRIMIR
              </button>
              {isEditOrder && (
                <button
                  className="bg-green-500 text-white text-lg px-4 py-3 rounded-2xl w-full focus:outline-none mt-2"
                  onClick={() => {
                    updateOrderSelected(false);
                    setPhoneClient('');
                    setAddress('');
                    setIsChecked(false);
                    setIsModalOpen(false);
                    setIsEditOrder(false);
                  }}
                >
                  SOLO GUARDAR CAMBIOS
                </button>
              )}
            </div>
          </div>
        </Modal>

        {/* {Sabores de Helado Modal} */}
        <Modal
          isOpen={openModalFlavors}
          onClose={() => {
            setOpenModalFlavors(!openModalFlavors);
            setIsModalOpen(false);
          }}
        >
          <div className="w-96 bg-white overflow-x-auto z-10 text-gray-500 h-auto max-h-[80vh]" id="print-area">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
              <h2 className="text-2xl font-bold mb-4">Sabores Disponibles</h2>
              <div className="flex justify-between h-10 mb-5">
                <input
                  type="text"
                  value={inputFlavors}
                  onChange={handleInputChange}
                  className="w-full h-10 px-2 mb-4 border border-gray-300 rounded-md"
                  placeholder="Ingrese el sabor disponible"
                />
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2">
                  Agregar
                </button>
              </div>

              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Sabor</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {flavorsList.map((flavor, index) => (
                    <tr key={index}>
                      <td className="border-b border-gray-300 py-2 text-left">{flavor.name}</td>
                      <td className="border-b border-gray-300 py-2 text-right">
                        <button onClick={() => handleDelete(flavor.id)} className="text-red-500 hover:text-red-700">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>

        {/* {end No print area} */}
      </div>

      <div id="invoices">
        {/* {Ticket De Cocina} */}
        {modalCockIsOpen && (
          <div className="text-left w-full text-[0.6rem] p-4 overflow-auto">
            <div className="text-center">
              <h2 className="text-lg font-semibold">Cocina</h2>
            </div>
            <div className="flex mt-2">
              {/* <div className="flex-grow">
              No. de items:{' '}
              {isEditOrder
                ? productsInOrder.filter((producto) => producto.quantity !== producto.initialQuantity).length
                : productsInOrder.length}
            </div> */}
            </div>
            <div className="flex justify-center text-center flex-col">
              <div className="text-md">{new Date().toLocaleString(undefined, { hour12: true })}</div>
              <div className="text-[0.6rem]">
                Direccion: <strong>{address.toUpperCase() || 'Sin Especificar'}</strong>
              </div>
              <div className="text-[0.6rem] mb-2">
                Celular: <strong>{phoneClient || 'Sin Especificar'}</strong>
              </div>
            </div>
            <div className="w-full" style={{ borderBottom: '1px dashed black' }}></div>
            <div>
              <table className="w-full text-[0.6rem]">
                <thead>
                  <tr>
                    <th className="py-1 w-1/12 text-center">#</th>
                    <th className="py-1 text-left">Item</th>
                    <th className="py-1 w-2/12 text-center">Cant</th>
                  </tr>
                </thead>
                <tbody>
                  {isEditOrder && orderSelected?.isPrint
                    ? productsInOrder
                        .filter((producto) => producto.quantity !== producto.initialQuantity)
                        .map((item: any, index: any) => (
                          <tr key={index}>
                            <td className="py-1 text-center">{index + 1}</td>
                            <td className="py-1 text-left">
                              <span>{item.name}</span>
                              <br />
                              {Object.values(item?.notes || []).map((note: any, index) => (
                                <small>
                                  {' '}
                                  <b>{index + 1}:</b> {note.note}, <br />1
                                </small>
                              ))}
                            </td>
                            <td className="py-1 text-center">
                              {item?.initialQuantity ? item.quantity - item?.initialQuantity : item.quantity}
                            </td>
                          </tr>
                        ))
                    : productsInOrder.map((item: any, index: any) => (
                        <tr key={index}>
                          <td className="py-1 text-center">{index + 1}</td>
                          <td className="py-1 text-left">
                            <span>{item.name}</span>
                            <br />
                            {Object.values(item?.notes || []).map((note: any, index) => (
                              <small>
                                {' '}
                                <b>{index + 1}:</b> {note.note}, <br />
                              </small>
                            ))}
                          </td>
                          <td className="py-1 text-center">{item.quantity}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="w-full my-2" style={{ borderBottom: '1px dashed black' }}></div>
            <div className="w-full justify-end flex">
              <span className="font-semibold text-right">SubTotal: ${new Intl.NumberFormat().format(calculateTotal())}</span>
            </div>
            {isChecked && (
              <div className="w-full justify-end flex">
                <span className="font-semibold text-right">Domicilio: ${new Intl.NumberFormat().format(1500)}</span>
              </div>
            )}
            <div className="w-full justify-end flex">
              <span className="font-bold text-right text-[0.8rem]">
                TOTAL: $
                {isChecked ? new Intl.NumberFormat().format(calculateTotal() + 1500) : new Intl.NumberFormat().format(calculateTotal())}
              </span>
            </div>
          </div>
        )}

        {modalIsOpen && (
          <div className="text-center w-full text-[0.6rem] p-4 overflow-auto justify-center">
            <div className="flex justify-center text-center flex-col">
              <div className=" text-[0.7rem] font-semibold">
                HELADERIA LA PISTA <br></br> DEL SABOR
              </div>
              <div className="text-md">Fecha: {new Date().toLocaleString(undefined, { hour12: true })}</div>
              <div className="text-md">Paola Andrea Galvis</div>
              <div className="text-md">NIT: 66873502-2</div>
              <div className="text-md">REGIMEN SIMPLE</div>
            </div>
            <div className="w-full" style={{ borderBottom: '1px dashed black' }}></div>
            <div>
              <table className="w-full text-[0.6rem]">
                <thead>
                  <tr>
                    <th className="py-1 w-1/12 text-center">#</th>
                    <th className="py-1 text-left">Item</th>
                    <th className="py-1 w-2/12 text-center">Cant</th>
                  </tr>
                </thead>
                <tbody>
                  {isEditOrder && orderSelected?.isPrint
                    ? productsInOrder
                        .filter((producto) => producto.quantity !== producto.initialQuantity)
                        .map((item: any, index: any) => (
                          <tr key={index}>
                            <td className="py-1 text-center">{index + 1}</td>
                            <td className="py-1 text-left">
                              <span>{item.name}</span>
                            </td>
                            <td className="py-1 text-center">
                              {item?.initialQuantity ? item.quantity - item?.initialQuantity : item.quantity}
                            </td>
                          </tr>
                        ))
                    : productsInOrder.map((item: any, index: any) => (
                        <tr key={index}>
                          <td className="py-1 text-center">{index + 1}</td>
                          <td className="py-1 text-left">
                            <span>{item.name}</span>
                          </td>
                          <td className="py-1 text-center">{item.quantity}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="w-full my-2" style={{ borderBottom: '1px dashed black' }}></div>
            <div className="w-full justify-end flex">
              <span className="font-semibold text-right">SubTotal: ${new Intl.NumberFormat().format(calculateTotal())}</span>
            </div>
            {isChecked && (
              <div className="w-full justify-end flex">
                <span className="font-semibold text-right">Domicilio: ${new Intl.NumberFormat().format(1500)}</span>
              </div>
            )}
            <div className="w-full justify-end flex">
              <span className="font-bold text-right text-[0.8rem]">
                TOTAL: $
                {isChecked ? new Intl.NumberFormat().format(calculateTotal() + 1500) : new Intl.NumberFormat().format(calculateTotal())}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
