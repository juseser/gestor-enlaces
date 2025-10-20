import { Bookmark, RefreshCw } from 'lucide-react';
import LinkCard from './LinkCard';

const LinkList = ({ 
    links, 
    fetchLinksAndStats, 
    startEdit, 
    handleDeleteLink, 
    isLoading 
}) => {
    return (
        <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Bookmark size={24} className='text-gray-600'/>
                <span>Tus Enlaces Guardados ({links.length})</span>
                <button 
                    onClick={fetchLinksAndStats} 
                    className="p-1 rounded-full text-gray-400 hover:text-blue-500 transition ml-auto" 
                    title="Recargar"
                    disabled={isLoading}
                >
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </h2>

            {links.length === 0 && !isLoading ? (
                <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100">
                    <p className="text-gray-500 text-lg">¡Aún no has guardado ningún enlace!</p>
                    <p className="text-gray-400 mt-2">Usa el formulario de la izquierda para empezar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {links.map(link => (
                        <LinkCard 
                            key={link.id} 
                            link={link} 
                            startEdit={startEdit}
                            handleDeleteLink={handleDeleteLink}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default LinkList;