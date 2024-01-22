/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  collection,
  updateDoc,
  doc,
  orderBy,
  onSnapshot,
  query,
} from "firebase/firestore";
// @ts-expect-error
import { db } from "../../config/firestore.js";
import EditModal from "../EditModal/EditModal.js";
import { useProductContext } from "../../context/ProductContext/ProductContext.js";
const TableInventory = () => {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [keyChange, setKeyChange] = useState<any>(false);
  const { setProductList, setCategories: setCategoriesList } = useProductContext();

  const handleRowClick = (row: any, key: any) => {
    setSelectedRow(row);
    setKeyChange(key);
  };

  const updateItem = async (rowId: any, newValue: any) => {
    setIsLoading(true);
    await updateDoc(doc(db, "products", rowId), {
      [keyChange]: newValue,
    }).then(() => {
      const updatedData = data.map((item) =>
        item.id === rowId ? { ...item, [keyChange]: newValue } : item
      );
      setProductList(updatedData as any);
      setData(updatedData);
    });
    setIsLoading(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    const collectionRef = collection(db, "products");
    const q = query(collectionRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductList(newData as any);
        setData(newData);
        const uniqueCategories = Array.from(
          new Set(newData.map((row: any) => row?.category))
        );
        setCategories(uniqueCategories);
        setCategoriesList(uniqueCategories);
      },
      (error) => {
        console.error("Error fetching data from Firestore:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="overflow-x-auto text-gray-500">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Producto</th>
            <th className="py-2 px-4 border-b">Categoria</th>
            <th className="py-2 px-4 border-b">Precio</th>
            <th className="py-2 px-4 border-b">Costo</th>
            <th className="py-2 px-4 border-b">Stock</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, index: any) => (
            <tr key={row.id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="py-2 px-4 border-b">{row?.name}</td>
              <td className="py-2 px-4 border-b">
                <select
                  value={row?.category}
                  onClick={() => handleRowClick(row, "category")}
                  onChange={(e) => updateItem(row.id, e.target.value)}
                  className="py-1 px-2 border rounded"
                >
                  <option value="" disabled>
                    Selecciona...
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </td>
              <td
                className="py-2 px-4 border-b"
                onClick={() => handleRowClick(row, "price")}
              >
                $ {new Intl.NumberFormat().format(row?.price)}
              </td>
              <td
                className="py-2 px-4 border-b"
                onClick={() => handleRowClick(row, "cost")}
              >
                $ {new Intl.NumberFormat().format(row?.cost)}
              </td>
              <td
                className="py-2 px-4 border-b"
                onClick={() => handleRowClick(row, "stock")}
              >
                {row?.stock}
              </td>
            </tr>
          ))}
        </tbody>
        {/* Modal para editar el precio */}
        {selectedRow && keyChange !== "category" && (
          <EditModal
            isOpen={!!selectedRow}
            rowData={selectedRow}
            productId={selectedRow.id}
            currentPrice={selectedRow[keyChange]}
            onClose={() => setSelectedRow(null)}
            onUpdate={updateItem}
            isLoadingSave={isLoading}
          />
        )}
      </table>
    </div>
  );
};

export default TableInventory;
