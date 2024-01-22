/* eslint-disable @typescript-eslint/no-explicit-any */
const TableOrders = () => {
  const data = [
    { id: 1, col1: 'A', col2: 'B', col3: 'C', col4: 'D', col5: 'E', col6: 'F', col7: 'G', col8: 'H' },
    { id: 2, col1: 'A', col2: 'B', col3: 'C', col4: 'D', col5: 'E', col6: 'F', col7: 'G', col8: 'H' },
    { id: 3, col1: 'A', col2: 'B', col3: 'C', col4: 'D', col5: 'E', col6: 'F', col7: 'G', col8: 'H' },
  ];

  const handleDeleteRow = (id: any) => {
    // Lógica para eliminar la fila con el ID proporcionado
    console.log(`Eliminar fila con ID ${id}`);
  };

  return (
    <div className="overflow-x-auto text-gray-500">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr >
            <th className="py-2 px-4 border-b">Fecha</th>
            <th className="py-2 px-4 border-b">No. Orden</th>
            <th className="py-2 px-4 border-b">Cajero</th>
            <th className="py-2 px-4 border-b">Total 4</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Mesa</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="py-2 px-4 border-b">{row.col1}</td>
              <td className="py-2 px-4 border-b">{row.col2}</td>
              <td className="py-2 px-4 border-b">{row.col3}</td>
              <td className="py-2 px-4 border-b">{row.col4}</td>
              <td className="py-2 px-4 border-b">{row.col5}</td>
              <td className="py-2 px-4 border-b">{row.col7}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleDeleteRow(row.id)}
                  className="text-red-600 hover:text-red-700 focus:outline-none"
                >
                  {/* Icono de borrar, puedes reemplazarlo con tu propio ícono */}
                  &#x1F5D1;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableOrders;
