/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Papa from "papaparse";
import {  ref, set } from "firebase/database";
// import { writeBatch, doc, collection, ref, set } from "firebase/database";
// @ts-expect-error
import { v4 as uuidv4 } from 'uuid';

// @ts-expect-error
import { db, realtimeDb } from "../../config/firestore.js";
const CsvUploader = () => {
  const [csvData, setCsvData] = useState(null);

  // const handleFileChange = (event: any) => {
  //   const file = event.target.files[0];

  //   Papa.parse(file, {
  //     complete: async (result: any) => {
  //       // `result` contiene la información analizada del CSV
  //       setCsvData(result.data);

  //       try {
  //         //   const batch = db.batch();
  //         const batch = writeBatch(db);

  //         result.data.forEach((item: any) => {
  //           if (item.trackStock !== undefined) {
  //             item.isStock = item.trackStock === "y";
  //             delete item.trackStock;
  //           }
  //           if (typeof item.price === "string") {
  //             item.price = parseFloat(item.price);
  //           }
  //           if (typeof item.cost === "string") {
  //             item.cost = parseFloat(item.cost);
  //           }
  //           if (typeof item.stock === "string") {
  //             item.stock = parseFloat(item.stock);
  //           }
  //           if (typeof item.flavors === "string") {
  //             item.flavors = parseFloat(item.flavors);
  //           }

  //           const newItemRef = doc(collection(db, "products"));
  //           batch.set(newItemRef, {...item, id: uuidv4()});
  //         });

  //         await batch.commit();
  //         console.log("Datos registrados en Firestore");
  //       } catch (error) {
  //         console.error("Error al registrar en Firestore:", error);
  //       }
  //     },
  //     header: true, // Supongamos que el archivo CSV tiene encabezados
  //   });
  // };

  const handleFileChange2 = (event: any) => {
    const file = event.target.files[0];
  
    Papa.parse(file, {
      complete: async (result: any) => {
        // `result` contiene la información analizada del CSV
        setCsvData(result.data);
  
        try {
          result.data.forEach((item: any) => {
            if (item.trackStock !== undefined) {
              item.isStock = item.trackStock === "y";
              delete item.trackStock;
            }
            if (typeof item.price === "string") {
              item.price = parseFloat(item.price);
            }
            if (typeof item.cost === "string") {
              item.cost = parseFloat(item.cost);
            }
            if (typeof item.stock === "string") {
              item.stock = parseFloat(item.stock);
            }
            if (typeof item.flavors === "string") {
              item.flavors = parseFloat(item.flavors);
            }
  
            const newItemKey = uuidv4();
            const newItemRef = ref(realtimeDb, `products/${newItemKey}`);
            set(newItemRef, { ...item, id: newItemKey });
          });
  
          console.log("Datos registrados en Realtime Database");
        } catch (error) {
          console.error("Error al registrar en Realtime Database:", error);
        }
      },
      header: true, // Supongamos que el archivo CSV tiene encabezados
    });
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange2}
        className="hidden"
        id="fileInput" // Asigna un ID para vincular con la etiqueta de la etiqueta de label
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-green-400 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center justify-center hover:bg-green-500 focus:bg-green-500 focus:outline-none transition duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Subir archivo
      </label>
      {csvData && (<><p>Se crearon los productos correctamente!</p></>)}
    </div>
  );
};

export default CsvUploader;
