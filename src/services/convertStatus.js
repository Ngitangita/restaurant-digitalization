export const convertStatusMenu = (status) => {
    switch(status) {
        case 'active':
            return 'Actif';
        case 'inactive':
            return 'Inactif';
        case 'discontinued':
            return 'Discontinué';
        default:
            return 'Statut inconnu';
    }
};


export const convertStatusToTable = (status) => {
    const statusMap = {
        'AVAILABLE': 'Disponible',
        'OCCUPIED': 'Occupé',
        'RESERVED': 'Réservé',
        'OUT_OF_SERVICE': 'Hors service',
        'CLEANING': 'Nettoyage'
    };

    const formattedStatus = statusMap[status.toUpperCase()] || 'Statut inconnu';

    return formattedStatus.toLowerCase();
};


export const convertStatusToRoom = (status) => {
    const statusMap = {
        'AVAILABLE': 'Disponible',
        'OCCUPIED': 'Occupé',
        'UNDER_MAINTENANCE': 'En maintenance',
        'RESERVED': 'Réservé',
        'OUT_OF_SERVICE': 'Hors service'
    };

    const formattedStatus = statusMap[status.toUpperCase()] || 'Statut inconnu';

    return formattedStatus.toLowerCase();
};


export const convertStatusToOrder = (status) => {
    const statusMap = {
        PENDING: 'En attente',
        COMPLETED: 'Terminé',
        CANCELED: 'Annulé',
        IN_PROGRESS: 'En cours',
    };

    return statusMap[status.toUpperCase()] || status;
};


    export const convertStatusToReservation = (status) => {
        const statusMap = {
            PENDING: 'En attente',
            CONFIRMED: 'Confirmé',
            COMPLETED: 'Terminé',
            CANCELED: 'Annulé',
            NO_SHOW: 'Non montrer',
        };
    
        return statusMap[status.toUpperCase()] || status;
    };
   
    export const convertStatusToPayment = (status) => {
        const statusMap = {
            PENDING: 'En attente',
            FAILED: 'Echoué',
            COMPLETED: 'Terminé',
            CANCELED: 'Annulé',
            REFUNDED: 'Remboursement',
        };
    
        return statusMap[status.toUpperCase()] || status;
    };