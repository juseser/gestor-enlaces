import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export const LoadingOverlay = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-2xl">
                <RefreshCw size={24} className="animate-spin text-blue-600" />
                <span className="text-lg font-semibold text-gray-700">Cargando...</span>
            </div>
        </div>
    );
};

export const MessageOverlay = ({ message }) => {
    if (!message) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl flex items-center space-x-3 transition-opacity duration-300 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <p className="font-medium">{message.text}</p>
        </div>
    );
};