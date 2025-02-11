export const convertMethodToPayment = (method) => {
    const paymentMethods = {
        cash: 'Espèces',
        mvola: 'MVola',
    };
    return paymentMethods[method.toLowerCase()] || 'Méthode de paiement inconnue';
};
