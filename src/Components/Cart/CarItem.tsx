/* eslint-disable @typescript-eslint/no-explicit-any */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { useProductContext } from '../../context/ProductContext/ProductContext';
const CarItem = ({ item, productSelected, isCreated, setProduct }: any) => {
    const selectedProductRef = useRef<any>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [noteTexts, setNoteTexts] = useState(Array.from({ length: item?.quantity || 0 }, () => ''));
    // const [addons, setAddons] = useState(Array.from({ length: item?.quantity || 0 }, () => ''));
    const { updateProductOrder, flavorsList } = useProductContext();

    const handleNoteChange = (index: any, value: string) => {
        const newNoteTexts = [...noteTexts];
        newNoteTexts[index] = value.replace(/^undefined/, '');
        setNoteTexts(newNoteTexts);
    };

    const formatterNotes = (): any[] => {
        const notesObjects: any = [];

        noteTexts.forEach((note, index) => {
            note = note.trim().replace(/,\s*$/, '');

            const noteObject = {
                id: index + 1,
                note: note,
            };

            notesObjects.push(noteObject);
        });

        console.log(notesObjects, 'notas');

        return notesObjects;

    };

  //   const formatterAdds = (): any[] => {
  //     const addonsObjects: any = [];

  //     addons.forEach((adds, index) => {
  //         adds = adds.trim().replace(/,\s*$/, '');

  //         const noteObject = {
  //             id: index + 1,
  //             adds: adds,
  //         };

  //         addonsObjects.push(noteObject);
  //     });

  //     console.log(addonsObjects, 'addons');

  //     return addonsObjects;

  // };

    useEffect(() => {
        if (selectedProductRef.current) {
            selectedProductRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [productSelected]);

    // const handleNoteChangeWithDb = (index: any, value: string) => {
    //   setIsChangedNote(true);
    //   console.log(index, value);
    //   const newNoteTexts = [...noteTexts];
    //   newNoteTexts[index] = value.replace(/^undefined/, "");
    //   setNoteTexts(newNoteTexts);
    // };

    useEffect(() => {
        // if (item && false) {
        //   const noteByProduct = item?.note.split(" | ");
        //   setNoteTexts(noteByProduct);
        // }
        if (item && Array.isArray(item.notes)) {
            const newArrayText = item?.notes?.map((item: any) => item.note + ', ');
            setNoteTexts(newArrayText);
        }
    }, [item]);

    const handleValueInput = (index: any) => {
        return noteTexts[index];
    };

    console.log('noteTExts', noteTexts);

    return (
        <div key={item.id} onClick={() => setProduct(item)}>
            <div
                key={item.id}
                ref={productSelected?.id === item?.id ? selectedProductRef : null}
                className={`mb-0 border-t-2 ${
                    productSelected?.id === item?.id ? 'bg-green-100' : 'bg-blue-gray-50'
                } w-full text-blue-gray-700 py-2 px-2 flex flex-col text-left`}
            >
                <div className="flex-grow flex justify-between">
                    <div>
                        <h5 className="text-sm text-left whitespace-normal font-semibold">{item?.name}</h5>
                        <h5 className="text-sm text-left whitespace-normal ml-2">
                            <b>{item?.quantity}</b> Unidades x $ {new Intl.NumberFormat().format(item?.price)} / Unidad
                        </h5>
                    </div>
                    <div>
                        {!isCreated && (
                            <FontAwesomeIcon
                                icon={faNoteSticky}
                                fontSize={20}
                                className="cursor-pointer mt-2"
                                onClick={() => setOpenModal(true)}
                            />
                        )}
                    </div>
                    <p className="text-sm text-right block font-bold">$ {new Intl.NumberFormat().format(item?.price * item?.quantity)}</p>
                </div>

                {noteTexts.length > 0 && noteTexts[0] !== '' ? (
                    <div className="flex">
                        <p className="text-black font-semibold text-sm ml-2">Nota: </p>
                        <p className="text-gra-400 font-normal text-sm ml-2">
                            {noteTexts?.map((note: any, _index) => (
                                <span key={_index}>
                                    <span className="font-bold">{_index + 1}:</span> {note}
                                </span>
                            ))}
                        </p>
                    </div>
                ) : null}
            </div>

            <div className={`fixed inset-0 z-50 flex items-center justify-center ${openModal ? '' : 'hidden'}`}>
                <div
                    className="absolute inset-0 bg-gray-800 opacity-50"
                    onClick={() => {
                        setOpenModal(!openModal);
                    }}
                ></div>
                <div className="bg-white p-8 rounded shadow-lg z-10 w-[400px]">
                    <h2 className="text-lg font-semibold mb-0">Agregar Nota</h2>
                    <span className="text-sm font-normal mb-2 flex justify-center">
                        Producto: <p className="font-semibold ml-1">{item?.name}</p>
                    </span>
                    {Array(item?.quantity)
                        .fill(undefined)
                        .map((_, index) => ({
                            value: index + 1, // Aquí asignamos un nuevo parámetro llamado "value" a cada elemento del arreglo
                            isAd: false, // Esto es solo un ejemplo, puedes agregar cualquier otra propiedad que desees
                        }))
                        .map((element, index) => (
                            <div key={element.value}>
                                <span className="text-sm font-normal flex justify-left ml-2 mt-2">Sabores del producto: {index + 1}</span>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        key={index}
                                        value={handleValueInput(index)}
                                        onChange={(e) => handleNoteChange(index, e.target.value)}
                                        autoComplete="off"
                                        className="w-full h-10 mr-2 text-left bg-none px-2 focus:outline-gray-800 text-gray-800 mt-2 ml-1 border border-gray-500 rounded-md"
                                        placeholder="Nota..."
                                    />
                                    <button className=" bg-cyan-300 text-white p-1 rounded-md font-semibold px-2 h-10 mt-2">AD</button>
                                </div>
                                <div className="overflow-auto whitespace-nowrap mt-2 custom-scrollbar">
                                    {flavorsList.map((flavor) => (
                                        <span
                                            key={flavor.id}
                                            className="inline-block bg-blue-500 text-white px-2 py-0 rounded-full cursor-pointer hover:bg-blue-600 text-sm mr-1"
                                            onClick={() => {
                                                handleNoteChange(index, noteTexts[index] + flavor?.name + ', ');
                                            }}
                                        >
                                            {flavor.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    <div className="flex justify-end mt-4 ">
                        <button className="mr-2" onClick={() => setOpenModal(false)}>
                            Cancelar
                        </button>
                        <button
                            className=" bg-cyan-300 text-white p-1 rounded-md font-semibold px-2"
                            onClick={() => {
                                updateProductOrder(item.id, { ...item, notes: { ...formatterNotes() }}, false);
                                setOpenModal(false);
                            }}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarItem;
