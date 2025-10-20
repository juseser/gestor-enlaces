/**
 * URL base para todas las llamadas a la API Flask.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Opciones de categoría disponibles para los enlaces.
 */
export const CATEGORY_OPTIONS = [
    'Programación', 
    'Redes y Ciberseguridad', 
    'Tecnología', 
    'Finanzas', 
    'Deportes', 
    'Música', 
    'Educación', 
    'Otros'
];

/**
 * Asigna una clase de color Tailwind CSS para cada categoría.
 */
export const getColorForCategory = (category) => {
    switch (category) {
        case 'Programación': return 'bg-blue-600';
        case 'Redes y Ciberseguridad': return 'bg-green-600';
        case 'Tecnología': return 'bg-yellow-600';
        case 'Finanzas': return 'bg-indigo-600';
        case 'Deportes': return 'bg-red-600';
        case 'Música': return 'bg-pink-600';
        case 'Educación': return 'bg-purple-600';
        case 'Otros': return 'bg-gray-500';
        default: return 'bg-gray-400';
    }
};