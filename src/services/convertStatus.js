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
