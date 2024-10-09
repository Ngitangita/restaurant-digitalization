import React from 'react';
import { useForm } from 'react-hook-form';
import { apiUrl, fetchJson } from '../../services/api';

const CreateCategories = ({ onClose, onCategoryCreated }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            await fetchJson(apiUrl("/categories"), 'POST', data);
            onCategoryCreated();
            onClose();
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">Nom de la catégorie</label>
                <input
                    id="name"
                    type="text"
                    {...register("name", { required: 'Le nom est requis' })}
                    className={`mt-1 block w-full p-2 outline-none border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className='flex flex-row gap-4'>
                <button type="submit" className="bg-blue-500 text-white p-2 px-4 rounded-md hover:bg-blue-600">
                    Créer
                </button>
                <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                    Annuler
                </button>
            </div>
        </form>

    );
};

export default CreateCategories;
