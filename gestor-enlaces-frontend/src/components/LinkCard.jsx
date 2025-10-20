import { Trash2, Edit2 } from 'lucide-react';
import { getColorForCategory } from '../utils/helpers.js';

const LinkCard = ({ link, startEdit, handleDeleteLink }) => (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col justify-between">
        <div className='flex-grow'>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors block leading-tight">
                {link.title || link.url}
            </a>
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 mt-2 rounded-full ${getColorForCategory(link.category)} text-white`}>
                {link.category}
            </span>
            <p className="text-sm text-gray-500 mt-2 truncate max-w-full">
                {link.url}
            </p>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
            <button
                onClick={() => startEdit(link)}
                className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition"
                aria-label="Editar enlace"
                title="Editar"
            >
                <Edit2 size={18} />
            </button>
            <button
                onClick={() => handleDeleteLink(link.id, link.title || link.url)}
                className="p-2 rounded-full text-red-500 hover:bg-red-100 transition"
                aria-label="Eliminar enlace"
                title="Eliminar"
            >
                <Trash2 size={18} />
            </button>
        </div>
    </div>
);

export default LinkCard;