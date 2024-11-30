import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiUrl, fetchJson } from "../../services/api";
import { useNavigate } from "react-router-dom";

const CustomerSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  phoneNumber: z.string().regex(/^(\+?\d{1,4}[-.\s]?)?(\d{10})$/, { message: "Numéro de téléphone invalide" }),
  email: z.string().email({ message: "Adresse e-mail invalide" }),
  address: z.string().min(5, { message: "L'adresse doit comporter au moins 5 caractères" })
});

const CreateCustomer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(CustomerSchema),
    mode: "onSubmit"
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await fetchJson(apiUrl("/customers"), 'POST', data);
      reset();
      navigate("/customers"); // Redirection vers la liste des clients après enregistrement
    } catch (error) {
      console.error("Erreur lors de la création du client :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Créer un Client</h2>

      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700">Prénom</label>
        <input
          id="firstName"
          type="text"
          {...register("firstName")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Prénom"
        />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700">Nom</label>
        <input
          id="lastName"
          type="text"
          {...register("lastName")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Nom"
        />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700">Numéro de téléphone</label>
        <input
          id="phoneNumber"
          type="tel"
          {...register("phoneNumber")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Numéro de téléphone"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700">Adresse</label>
        <textarea
          id="address"
          {...register("address")}
          className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Adresse"
          rows="3"
        ></textarea>
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      <div className="text-right">
        <button type="submit" className="bg-indigo-600 text-white p-2 px-4 rounded-md hover:bg-indigo-700" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button type="button" className="bg-gray-300 text-gray-800 p-2 px-4 rounded-md hover:bg-gray-400 ml-2">
          Annuler
        </button>
      </div>
    </form>
  );
};

export default CreateCustomer;
