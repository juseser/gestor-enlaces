import { Bookmark } from 'lucide-react';
// Importaciones que sí existen en tu estructura:
import LinkForm from './components/LinkForm';
import LinkList from './components/LinkList';
import StatsCard from './components/StatsCard';
import { LoadingOverlay, MessageOverlay } from './components/Overlays';
import useLinkService from './hooks/useLinkService'; 

const App = () => {
    // Usar el hook para obtener todo el estado y las funciones.
    const {
        links,
        stats,
        totalLinks,
        form,
        setForm,
        editLink,
        setEditLink,
        isLoading,
        isAnalyzing,
        message,
        fetchLinksAndStats,
        handleCreateLink,
        handleUpdateLink,
        handleDeleteLink,
        analyzeUrl,
    } = useLinkService(); 

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8">
            
            {/* Overlays de UI (Carga y Mensajes) */}
            <LoadingOverlay isLoading={isLoading} />
            <MessageOverlay message={message} />

            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center space-x-2">
                    <Bookmark size={32} className="text-blue-600" />
                    <span>Gestor de Enlaces PRO</span>
                </h1>
                <p className="text-gray-500 mt-2">API Flask & Frontend React</p>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna 1: Formulario y Estadísticas */}
                <div className="lg:col-span-1 space-y-8">
                    <LinkForm
                        form={form}
                        setForm={setForm}
                        editLink={editLink}
                        setEditLink={setEditLink}
                        isAnalyzing={isAnalyzing}
                        analyzeUrl={analyzeUrl}
                        handleCreateLink={handleCreateLink}
                        handleUpdateLink={handleUpdateLink}
                        isLoading={isLoading}
                    />

                    <StatsCard stats={stats} totalLinks={totalLinks} />
                </div>
                
                {/* Columna 2 y 3: Lista de Enlaces */}
                <div className="lg:col-span-2">
                    <LinkList
                        links={links} 
                        fetchLinksAndStats={fetchLinksAndStats}
                        startEdit={setEditLink} 
                        handleDeleteLink={handleDeleteLink}
                        isLoading={isLoading}
                    />
                </div>

            </main>
        </div>
    );
};

export default App;