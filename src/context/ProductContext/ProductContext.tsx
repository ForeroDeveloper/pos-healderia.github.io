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
  categoriesList: any[];
  productsInOrder: any[];
  addProduct: (newProduct: any) => void;
  addProductOrder: (newProduct: any) => void;
  removeProduct: (productId: number) => void;
  removeProductOrder: (productId: number) => void;
  updateProduct: (productId: number, updatedProduct: any) => void;
  updateProductOrder: (productId: number, updatedProduct: any) => void;
  setProductList: (newProductList: any[]) => void;
  setCategories: (categories: any[]) => void;
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
  const [categoriesList, setCategories] = useState<any[]>([]);
  const [productsInOrder, setProductsInOrder] = useState<any[]>([]);

  const addProduct = (newProduct: any) => {
    setProductList((prevList) => [...prevList, newProduct]);
  };

  const addProductOrder = (newProduct: any) => {
    const existingProductIndex = productsInOrder.findIndex(
      (product) => product.id === newProduct.id
    );

    if (existingProductIndex !== -1) {
      setProductsInOrder((prevList) => {
        const updatedList = [...prevList];
        updatedList[existingProductIndex] = {
          ...updatedList[existingProductIndex],
          quantity: updatedList[existingProductIndex].quantity + 1,
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

  const updateProductOrder = (productId: number, updatedProduct: any) => {
    setProductsInOrder((prevList) =>
      prevList
        .map((product) =>
          product.id === productId
            ? {
                ...updatedProduct,
                quantity: Math.max(0, product.quantity - 1),
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
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};