/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from "react";

// interface Product {
//   id: number;
//   // Agrega otras propiedades según la estructura de tu producto
//   // Por ejemplo: name: string, price: number, etc.
// }

interface ProductContextProps {
  productList: any[];
  flavorsList: any[];
  categoriesList: any[];
  productsInOrder: any[];
  orderSelected: any;
  isEditOrder: boolean;
  addProduct: (newProduct: any) => void;
  addProductOrder: (newProduct: any, quantity?: number) => void;
  removeProduct: (productId: number) => void;
  removeProductOrder: (productId: number) => void;
  updateProduct: (productId: number, updatedProduct: any) => void;
  updateProductOrder: (
    productId: number,
    updatedProduct: any,
    isDelete?: boolean
  ) => void;
  setProductList: (newProductList: any[]) => void;
  setProductsInOrder: (newProductList: any[]) => void;
  setFlavorsList: (newProductList: any[]) => void;
  setCategories: (categories: any[]) => void;
  setOrderSelected: (categories: any[] | null) => void;
  setProductsInOrderByDbHandler: (productsByDb: any[] | null) => void;
  setIsEditOrder: (isEdit: boolean) => void;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

export const useProductContext = (): ProductContextProps => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [productList, setProductList] = useState<any[]>([]);
  const [flavorsList, setFlavorsList] = useState<any[]>([]);
  const [categoriesList, setCategories] = useState<any[]>([]);
  const [productsInOrder, setProductsInOrder] = useState<any[]>([]);
  const [orderSelected, setOrderSelected] = useState<any | null>(null);
  const [isEditOrder, setIsEditOrder] = useState<boolean>(false);

  const addProduct = (newProduct: any) => {
    setProductList((prevList) => [...prevList, newProduct]);
  };

  const addProductOrder = (newProduct: any, quantity = 1) => {
    const existingProductIndex = productsInOrder.findIndex(
      (product) => product.id === newProduct.id
    );

    if (existingProductIndex !== -1) {
      setProductsInOrder((prevList) => {
        const updatedList = [...prevList];
        updatedList[existingProductIndex] = {
          ...updatedList[existingProductIndex],
          quantity: updatedList[existingProductIndex].quantity + quantity,
        };
        return updatedList;
      });
    } else {
      setProductsInOrder((prevList) => [
        ...prevList,
        { ...newProduct, quantity: 1 },
      ]);
    }
  };

  const removeProduct = (productId: number) => {
    setProductList((prevList) =>
      prevList.filter((product) => product.id !== productId)
    );
  };

  const removeProductOrder = (productId: number) => {
    setProductsInOrder((prevList) =>
      prevList.filter((product) => product.id !== productId)
    );
  };

  const updateProduct = (productId: number, updatedProduct: any) => {
    setProductList((prevList) =>
      prevList.map((product) =>
        product.id === productId ? updatedProduct : product
      )
    );
  };

  const updateProductOrder = (
    productId: number,
    updatedProduct: any,
    isDelete: boolean = true
  ) => {
    console.log('llega', updateProduct)
    setProductsInOrder((prevList) =>
      prevList
        .map((product) =>
          product.id === productId
            ? {
                ...updatedProduct,
                quantity: isDelete
                  ? Math.max(0, product.quantity - 1)
                  : product.quantity,
              }
            : product
        )
        .filter((product) => product.quantity > 0)
    );
  };

  const setProductListHandler = (newProductList: any[]) => {
    setProductList(newProductList);
  };
  const setCategoriesListHandler = (newProductList: any[]) => {
    setCategories(newProductList);
  };
  const setFlavorsListHandler = (flavorsByDB: any[]) => {
    setFlavorsList(flavorsByDB);
  };
  const setOrderSelectedHandler = (order: any) => {
    setOrderSelected(order);
  };
  const setProductsInOrderByDbHandler = (productsInOrder: any) => {
    setProductsInOrder(productsInOrder);
  };
  const setIsEditDbHandler = (isEdit: boolean) => {
    setIsEditOrder(isEdit);
  };

  const value: ProductContextProps = {
    productList,
    addProduct,
    removeProduct,
    updateProduct,
    addProductOrder,
    updateProductOrder,
    removeProductOrder,
    productsInOrder,
    categoriesList,
    setCategories: setCategoriesListHandler,
    setProductList: setProductListHandler,
    setProductsInOrder,
    flavorsList,
    setFlavorsList: setFlavorsListHandler,
    orderSelected,
    setProductsInOrderByDbHandler,
    setIsEditOrder: setIsEditDbHandler,
    isEditOrder,
    setOrderSelected: setOrderSelectedHandler,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
