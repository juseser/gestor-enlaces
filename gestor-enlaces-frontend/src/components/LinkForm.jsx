import { useEffect } from 'react';
import { Bookmark, Edit2, Zap } from 'lucide-react';
import { CATEGORY_OPTIONS } from '../utils/helpers.js';

const LinkForm = ({
    form,
    setForm,
    editLink,
    setEditLink,
    isAnalyzing,
    analyzeUrl,
    handleCreateLink,
    handleUpdateLink,
    isLoading,
}) => {
    // --- Lógica de Auto-Análisis (Debouncing) ---
    useEffect(() => {
        const currentData = editLink || form;
        const currentSetData = editLink ? setEditLink : setForm;
        
        const timer = setTimeout(() => {
            if (currentData.url) {
                analyzeUrl(currentData.url, currentData, currentSetData);
            }
        }, 800);
        
        return () => clearTimeout(timer); 
    }, [editLink, form.url, analyzeUrl]); 

    // --- MANEJO DE CAMBIOS ---
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (editLink) {
             setEditLink(prev => ({ ...prev, [name]: value }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- MANEJO DE SUBMIT ---
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editLink) {
            handleUpdateLink(editLink);
        } else {
            if (!form.url) return; 
            handleCreateLink(form);
        }
    }
    
    const currentFormState = editLink || form;
    const isEditMode = !!editLink;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                {isEditMode ? (
                    <>
                        <Edit2 size={20} className='text-blue-500'/>
                        <span>Editar Enlace</span>
                    </>
                ) : (
                    <>
                        <Bookmark size={20} className='text-blue-500'/>
                        <span>Añadir Nuevo Enlace</span>
                    </>
                )}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="relative">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        required
                        placeholder="https://ejemplo.com"
                        value={currentFormState.url}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                    />
                    {isAnalyzing && <Zap size={18} className="absolute right-3 top-9 text-blue-500 animate-pulse" title="Analizando URL..." />}
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Título del enlace (opcional)"
                        value={currentFormState.title}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select
                        id="category"
                        name="category"
                        value={currentFormState.category}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border bg-white"
                    >
                        {CATEGORY_OPTIONS.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div className='flex space-x-3'>
                    <button
                        type="submit"
                        disabled={isLoading || isAnalyzing}
                        className="w-full justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:bg-gray-400"
                    >
                        {isEditMode ? 'Guardar Cambios' : 'Crear Enlace'}
                    </button>
                    
                    {isEditMode && (
                        <button
                            type="button"
                            onClick={() => setEditLink(null)}
                            className="py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LinkForm;