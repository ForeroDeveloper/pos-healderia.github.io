/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { NumericFormat } from "react-number-format";

const EditModal = ({
  isOpen,
  productId,
  currentPrice,
  onClose,
  onUpdate,
  rowData,
  isLoadingSave,
}: any) => {
  const [newPrice, setNewPrice] = useState(currentPrice);

  const handleUpdate = () => {
    if (isLoadingSave) {
      return;
    }
    onUpdate(productId, newPrice);
  };

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    console.log();
    setNewPrice(Number(inputValue.replace(/,/g, "")));
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleUpdate();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-gray-800 opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-8 rounded shadow-lg z-10 w-[300px]">
        <h2 className="text-lg font-semibold mb-0">Modificar Valor</h2>
        <h2 className="text-sm font-normal mb-4">{rowData?.name}</h2>
        <NumericFormat
          value={String(currentPrice)}
          className="py-1 px-2 border rounded mb-2 w-full border-cyan-400"
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          allowLeadingZeros
          prefix="$ "
          thousandSeparator=","
        />
        <div className="flex justify-end mt-2">
          <button
            className="mr-2 bg-cyan-300 text-white p-1 rounded-md font-semibold px-2"
            onClick={handleUpdate}
          >
            {isLoadingSave ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
