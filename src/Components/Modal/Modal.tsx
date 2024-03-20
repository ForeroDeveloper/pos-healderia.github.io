/* eslint-disable @typescript-eslint/no-explicit-any */
const Modal = ({ isOpen, onClose, children }: any) => {
  const handleBackdropClick = (e: any) => {
    if (e.target === e.currentTarget) {
      // Si el clic fue en el fondo oscuro, cierra la modal
      onClose();
    }
  };
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div
            className="fixed inset-0 bg-gray-800 opacity-50"
            onClick={handleBackdropClick}
          ></div>
          <div className="bg-white p-4 rounded-md z-10">{children}</div>
        </div>
      )}
    </>
  );
};

export default Modal;
