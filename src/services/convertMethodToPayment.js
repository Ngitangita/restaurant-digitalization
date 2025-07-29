export const convertMethodToPayment = (method) => {
  if (!method) return "Non spécifié"; 

  const map = {
    CASH: "Espèces",
    MVOLA: "Mvola",
    ORANGE_MONEY: "Orange Money",
  };

  return map[method.toUpperCase()] || method;
};
