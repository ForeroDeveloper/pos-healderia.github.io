import { useProductContext } from "../../context/ProductContext/ProductContext";

/* eslint-disable @typescript-eslint/no-explicit-any */
const TableOrders = ({ orders }: any) => {
  const { setOrderSelected } = useProductContext();

  const ordersOrdenados = [...orders].sort((a, b) => {
    const fechaA = a.orderId || 0;
    const fechaB = b.orderId || 0;
    return fechaB - fechaA;
  });

  return (
    <div className="overflow-x-auto text-gray-500">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Hora</th>
            <th className="py-2 px-4 border-b">No. Orden</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Es Domicilio</th>
            <th className="py-2 px-4 border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          {ordersOrdenados.map((row: any, index: number) => (
            <tr
              key={row.id}
              className={`${index % 2 === 0 ? "bg-gray-100" : ""} ${
                row.orderStatus === "PAID" ? "bg-green-200 border border-green-400" : ""
              } cursor-pointer `}
              onClick={() => setOrderSelected(row)}
            >
              <td className="py-2 px-4 border-b">
                {row?.date?.split(" ")[1] + " " + row?.date?.split(" ")[2]}
              </td>
              <td className="py-2 px-4 border-b">{row?.orderId || "#"}</td>
              <td className="py-2 px-4 border-b">{row?.orderStatus}</td>
              <td className="py-2 px-4 border-b">
                {row?.isDelivery ? "SI" : "NO"}
              </td>
              <td className="py-2 px-4 border-b">
                $ {new Intl.NumberFormat().format(row?.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableOrders;
