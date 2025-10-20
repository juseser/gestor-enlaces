import { BarChart2 } from 'lucide-react';
import { getColorForCategory } from '../utils/helpers.js';

const StatsCard = ({ stats, totalLinks }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <BarChart2 size={20} className='text-teal-500'/>
                <span>Estadísticas por Categoría</span>
            </h2>
            
            {totalLinks === 0 ? (
                <p className="text-gray-500">No hay enlaces guardados para mostrar estadísticas.</p>
            ) : (
                <div className='space-y-3'>
                    <p className="text-sm font-medium text-gray-700">Total de Enlaces: <span className='font-extrabold text-lg text-teal-600'>{totalLinks}</span></p>

                    {stats.map(stat => {
                        const percentage = totalLinks > 0 ? (stat.count / totalLinks) * 100 : 0;
                        return (
                            <div key={stat.category}>
                                <div className="flex justify-between text-sm font-medium text-gray-700">
                                    <span>{stat.category}</span>
                                    <span>{stat.count} ({percentage.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                    <div 
                                        className={`h-2.5 rounded-full ${getColorForCategory(stat.category)}`} 
                                        style={{ width: `${percentage}%` }}
                                        title={`${stat.count} enlaces`}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StatsCard;