import { useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
    id: number;
    vehicle: string;
    plate_number: string;
    reference: string;
    driver: string;
    event_time: string;
    event_name: string;
    event_type: string;
    speed: number;
    position: {
        latitude: number;
        longitude: number;
    };
    address: string;
    poi_name: string;
    is_poi: boolean;
    creation_date: string;
}

interface EventStats {
    total_events: number;
    events_by_type: Record<string, number>;
    events_by_vehicle: Record<string, number>;
    unique_vehicles: number;
    date_range: {
        start: string | null;
        end: string | null;
    };
}

interface EventHistoryResponse {
    success: boolean;
    events: Event[];
    events_by_type: Record<string, Event[]>;
    events_by_vehicle: Record<string, { vehicle: string; plate_number: string; events: Event[] }>;
    events_by_date: Record<string, Event[]>;
    stats: EventStats;
    raw_total: number;
}

export default function EventHistoryExample() {
    const [events, setEvents] = useState<Event[]>([]);
    const [stats, setStats] = useState<EventStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('2025-12-01');
    const [endDate, setEndDate] = useState('2025-12-31');

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<EventHistoryResponse>('/api/events', {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
            });

            if (response.data.success) {
                setEvents(response.data.events);
                setStats(response.data.stats);
            } else {
                setError('Aucun événement trouvé pour cette période');
            }
        } catch (err) {
            setError('Erreur lors de la récupération des événements');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Historique des Événements</h1>

            {/* Filtres de date */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de début
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de fin
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>
                    <button
                        onClick={fetchEvents}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Rechercher'}
                    </button>
                </div>
            </div>

            {/* Statistiques */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600">Total événements</div>
                        <div className="text-2xl font-bold">{stats.total_events}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600">Véhicules uniques</div>
                        <div className="text-2xl font-bold">{stats.unique_vehicles}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600">Types d'événements</div>
                        <div className="text-2xl font-bold">
                            {Object.keys(stats.events_by_type).length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="text-sm text-gray-600">Période</div>
                        <div className="text-sm font-medium">
                            {stats.date_range.start ? new Date(stats.date_range.start).toLocaleDateString() : 'N/A'}
                            {' - '}
                            {stats.date_range.end ? new Date(stats.date_range.end).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>
            )}

            {/* Répartition par type d'événement */}
            {stats && Object.keys(stats.events_by_type).length > 0 && (
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-3">Répartition par type</h2>
                    <div className="space-y-2">
                        {Object.entries(stats.events_by_type).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                                <span className="text-sm font-medium">{type}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{
                                                width: `${(count / stats.total_events) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">
                                        {count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Erreur */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Liste des événements */}
            {events.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Date/Heure
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Véhicule
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Événement
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Vitesse
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Lieu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Conducteur
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {events.slice(0, 50).map((event, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {new Date(event.event_time).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {event.vehicle}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {event.plate_number}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{event.event_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {event.event_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {event.speed} km/h
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {event.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {event.driver}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {events.length > 50 && (
                        <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 text-center">
                            Affichage de 50 événements sur {events.length} au total
                        </div>
                    )}
                </div>
            ) : (
                !loading &&
                !error && (
                    <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                        Aucun événement trouvé pour cette période
                    </div>
                )
            )}
        </div>
    );
}
