import { useState } from "react";

export default function PaymentForm() {
    const [type, setType] = useState("creditCard");
    const [paymentData, setPaymentData] = useState({
        name: "",
        cardNumber: "",
        expirationDate: "",
        cvv: "",
        amount: ""
    });

    const onChangeData = (e) => {
        const { name, value } = e.target;
        setPaymentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="overflow-hidden bg-gray-100 h-screen">
            <div className="bg-black/80 h-screen flex flex-row justify-around items-center">
                <div className="border border-white w-1/2 p-4">
                    <p className="text-white">Welcome to the payment section. Please fill in the details to complete your payment.</p>
                </div>
                <div className="h-auto p-5 bg-gradient-to-l from-black/80 to-gray-300/80 rounded">
                    <div className="text-center py-2">
                        <div className="mb-4">
                            <div className="flex flex-col justify-center items-center py-2">
                                <img src="../public/payment-logo.png" alt="Payment Logo" className="w-20 h-20 rounded-full" />
                            </div>
                            <span className="text-2xl font-bold">
                                Complete Your Payment
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-around mb-4">
                            <button
                                aria-label="Select Credit Card Payment"
                                className={`px-4 py-2 rounded-lg ${type === "creditCard" ? "bg-gradient-to-r from-gray-800 to-gray-300/80 text-white" : "bg-gray-200"}`}
                                onClick={() => setType("creditCard")}>
                                Credit Card
                            </button>
                            <button
                                aria-label="Select PayPal Payment"
                                className={`px-4 py-2 rounded-lg ${type === "paypal" ? "bg-gradient-to-l from-gray-800 to-gray-300/80 text-white" : "bg-gray-200"}`}
                                onClick={() => setType("paypal")}>
                                PayPal
                            </button>
                        </div>

                        {type === "creditCard" ? (
                            <form className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3">
                                    <div className="w-92 flex flex-row gap-2 items-center justify-between">
                                        <label htmlFor="name" className="text-gray-700">Name on Card</label>
                                        <input
                                            name="name"
                                            id="name"
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-72 px-4 py-2 border rounded-lg bg-white/10 outline-none"
                                            onChange={onChangeData}
                                            value={paymentData.name}
                                        />
                                    </div>
                                    <div className="w-92 flex flex-row gap-2 items-center justify-between">
                                        <label htmlFor="cardNumber" className="text-gray-700">Card Number</label>
                                        <input
                                            name="cardNumber"
                                            id="cardNumber"
                                            type="text"
                                            placeholder="1234 5678 9123 4567"
                                            className="w-72 px-4 py-2 border rounded-lg bg-white/10 outline-none"
                                            onChange={onChangeData}
                                            value={paymentData.cardNumber}
                                        />
                                    </div>
                                    <div className="w-92 flex flex-row gap-2 items-center justify-between">
                                        <label htmlFor="expirationDate" className="text-gray-700">Expiration Date</label>
                                        <input
                                            name="expirationDate"
                                            id="expirationDate"
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-72 px-4 py-2 border rounded-lg bg-white/10 outline-none"
                                            onChange={onChangeData}
                                            value={paymentData.expirationDate}
                                        />
                                    </div>
                                    <div className="w-92 flex flex-row gap-2 items-center justify-between">
                                        <label htmlFor="cvv" className="text-gray-700">CVV</label>
                                        <input
                                            name="cvv"
                                            id="cvv"
                                            type="password"
                                            placeholder="***"
                                            className="w-72 px-4 py-2 border rounded-lg bg-white/10 outline-none"
                                            onChange={onChangeData}
                                            value={paymentData.cvv}
                                        />
                                    </div>
                                    <div className="w-92 flex flex-row gap-2 items-center justify-between">
                                        <label htmlFor="amount" className="text-gray-700">Amount</label>
                                        <input
                                            name="amount"
                                            id="amount"
                                            type="text"
                                            placeholder="$100.00"
                                            className="w-72 px-4 py-2 border rounded-lg bg-white/10 outline-none"
                                            onChange={onChangeData}
                                            value={paymentData.amount}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-gray-300/80 text-white rounded-lg">
                                    Pay Now
                                </button>
                            </form>
                        ) : (
                            <div className="text-center">
                                <span className="text-xl">PayPal is currently not available. Please use a credit card.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
