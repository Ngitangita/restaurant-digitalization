import { useEffect } from "react";
import {convertStatusToReservation} from "../../services/convertStatus.js";
import dayjs from "dayjs";

const ReservationCard = ({ reservation }) => {

    useEffect(() => {
        console.log(reservation);
    }, [reservation]);

    const { customer, room, table , status} = reservation.data;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-4xl font-extrabold text-blue-700 mb-6 w-full" style={{fontFamily: 'Arial, sans-serif'}}>
                Détails de la Réservation
            </h2>
            <div className="flex flex-col justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-medium text-gray-800 mb-2" style={{fontFamily: 'Verdana, sans-serif'}}>
                        Informations de la Réservation
                    </h3>
                    <p className="text-sm first-letter:text-xl first-letter:ml-12 first-letter:font-bold first-letter:text-blue-600">
                        La réservation porte sur : <strong
                        className="font-semibold">{reservation.title}</strong>.
                        La date de début est <strong
                        className="font-semibold ">{dayjs(reservation.start).format('DD/MM/YYYY HH:mm')} </strong>
                        et la date de fin est <strong
                        className="font-semibold ">{dayjs(reservation.end).format('DD/MM/YYYY HH:mm')} </strong>.
                        Le statut de cette réservation est <strong
                        className="font-semibold ">{convertStatusToReservation(status)}</strong>.
                    </p>
                </div>

                <div className="flex-1 mb-6">
                    <h3 className="text-2xl font-medium text-gray-800 mb-2" style={{fontFamily: 'Verdana, sans-serif'}}>
                        Informations du Client
                    </h3>
                    <p className="text-sm first-letter:text-xl first-letter:ml-12 first-letter:font-bold first-letter:text-blue-600">
                        Le client, <strong
                        className="font-semibold text-gray-600">{customer.firstName} {customer.lastName}</strong>,
                        peut être contacté au <strong
                        className="font-semibold text-gray-600">{customer.phoneNumber}</strong>.
                        Il a fourni son email comme <strong
                        className="font-semibold text-gray-600">{customer.email} </strong>
                        et réside à l'adresse suivante : <strong
                        className="font-semibold text-gray-600">{customer.address}</strong>.
                    </p>
                </div>
            </div>


            {table && room && (
                <div className="mb-6">
                    <h3 className="text-2xl font-medium text-gray-800 mb-2" style={{fontFamily: 'Verdana, sans-serif'}}>
                        Informations sur la Chambre et la Table
                    </h3>
                    {room && (
                        <p>
                            <strong className="font-semibold text-gray-600">Chambre n° :</strong> {room.id}
                        </p>
                    )}
                    {table && (
                        <p>
                            <strong className="font-semibold text-gray-600">Table :</strong> {table.id}
                        </p>
                    )}
                </div>
            )}
        </div>

    );
};

export default ReservationCard;
