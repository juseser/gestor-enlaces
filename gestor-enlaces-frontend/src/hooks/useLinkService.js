import { useState, useEffect, useCallback, useMemo } from 'react';
import { API_BASE_URL, CATEGORY_OPTIONS } from '../utils/helpers.js';

// Estado inicial del formulario (limpio)
const initialFormState = { 
    url: '', 
    title: '', 
    category: CATEGORY_OPTIONS[CATEGORY_OPTIONS.length - 1] // 'Otros'
};

/**
 * Custom Hook que encapsula toda la lógica de estado y llamadas a la API (CRUD).
 * El componente App.jsx solo necesita consumir los valores y las funciones.
 */
const useLinkService = () => {
    // --- ESTADO GLOBAL ---
    const [links, setLinks] = useState([]);
    const [stats, setStats] = useState([]);
    const [form, setForm] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [editLink, setEditLink] = useState(null); 
    const [message, setMessage] = useState(null); 

    // --- MANEJO DE MENSAJES ---
    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => setMessage(null), 3000);
    };

    // --- FETCHING DE DATOS (READ) ---

    // Función principal para obtener enlaces y estadísticas
    const fetchLinksAndStats = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch Links
            const linksResponse = await fetch(`${API_BASE_URL}/links`);
            const linksData = await linksResponse.json();
            if (linksResponse.ok && Array.isArray(linksData)) {
                // Mapear _id a id para consistencia en React
                const mappedLinks = linksData.map(link => ({ ...link, id: link._id || link.id }));
                setLinks(mappedLinks);
            } else {
                throw new Error("Error al cargar enlaces.");
            }

            // Fetch Stats
            const statsResponse = await fetch(`${API_BASE_URL}/stats`);
            const statsData = await statsResponse.json();
            if (statsResponse.ok && Array.isArray(statsData)) {
                setStats(statsData);
            } else {
                // Si falla stats, no es crítico, solo muestra un mensaje de advertencia
                console.warn("No se pudieron cargar las estadísticas.");
            }
        } catch (error) {
            console.error("Error general al obtener datos:", error);
            showMessage("Error de conexión o fallo al obtener datos.", 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Se ejecuta al montar el componente para cargar datos iniciales
    useEffect(() => {
        fetchLinksAndStats();
    }, [fetchLinksAndStats]);

    // --- LÓGICA DE NEGOCIO (CRUD) ---

    const handleCreateLink = async (linkData) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/links`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(linkData)
            });
            const data = await response.json();
            if (response.status === 201) {
                showMessage(`Enlace '${data.title_used}' creado con éxito.`, 'success');
                setForm(initialFormState); // Resetear formulario
                fetchLinksAndStats();
            } else {
                throw new Error(data.error || "Fallo en la creación del enlace.");
            }
        } catch (error) {
            showMessage(`Error al crear: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateLink = async (linkData) => {
        if (!linkData || !linkData.id) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/links/${linkData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: linkData.url, title: linkData.title, category: linkData.category })
            });
            if (response.ok) {
                showMessage(`Enlace actualizado con éxito.`, 'success');
                setEditLink(null); // Salir del modo edición
                fetchLinksAndStats();
            } else {
                const data = await response.json();
                throw new Error(data.error || "Fallo al actualizar el enlace.");
            }
        } catch (error) {
            showMessage(`Error al actualizar: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLink = async (id, title) => {
        // En un proyecto real se usaría un modal/overlay, no window.confirm()
        if (!window.confirm(`¿Estás seguro de eliminar el enlace: "${title}"?`)) return; 
        
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/links/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showMessage(`Enlace '${title}' eliminado.`, 'success');
                fetchLinksAndStats();
            } else {
                const data = await response.json();
                throw new Error(data.error || "Fallo al eliminar el enlace.");
            }
        } catch (error) {
            showMessage(`Error al eliminar: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeUrl = useCallback(async (url, currentForm, setCurrentForm) => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl.startsWith('http')) return; 

        setIsAnalyzing(true);
        try {
            const response = await fetch(`${API_BASE_URL}/analyze_link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: trimmedUrl })
            });
            const data = await response.json();
            
            if (response.ok) {
                // Si la API devuelve título/categoría, actualiza el formulario
                setCurrentForm(prev => ({
                    ...prev,
                    title: data.title !== 'Título no disponible' ? data.title : prev.title,
                    category: data.category_guess !== 'Sin Categoría' ? data.category_guess : prev.category
                }));
            }
        } catch (error) {
            console.error("Error en el análisis de URL:", error);
        } finally {
            setIsAnalyzing(false);
        }
    }, []);
    
    // Calcula la lista de enlaces ordenada
    const sortedLinks = useMemo(() => 
        [...links].sort((a, b) => b.id.localeCompare(a.id)), [links]
    );

    // Calcula el total de enlaces para las estadísticas
    const totalLinks = useMemo(() => 
        stats.reduce((sum, stat) => sum + stat.count, 0), [stats]
    );

    // Retorna todos los estados y funciones que el componente App.jsx necesita
    return {
        links: sortedLinks,
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
        showMessage,
    };
};

export default useLinkService;
