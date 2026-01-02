<?php

namespace App\Services;

use App\Models\Account;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Exception;

class EventHistoryService
{
    /**
     * Fetch event history data from TARGA TELEMATICS platform
     *
     * @param Account $account
     * @param string|null $startDate Format: Y-m-d
     * @param string|null $endDate Format: Y-m-d
     * @param array $filters Additional filters (vehicle, event type, etc.)
     * @return array
     */
    public function fetchEventHistoryData(Account $account, ?string $startDate = null, ?string $endDate = null, array $filters = []): array
    {
        try {
            // Get TARGA TELEMATICS platform configuration
            $platform = $account->platforms()
                ->where('name', 'TARGA TELEMATICS')
                ->first();

            if (!$platform) {
                Log::warning("TARGA TELEMATICS platform not configured for account {$account->id}");
                return $this->getEmptyData();
            }

            $apiUrl = rtrim($platform->pivot->api_url ?? '', '/');
            $apiToken = $platform->pivot->api_token;

            if (!$apiUrl || !$apiToken) {
                Log::warning("Missing API credentials for TARGA TELEMATICS on account {$account->id}");
                return $this->getEmptyData();
            }

            // Default date range: last 7 days
            if (!$startDate) {
                $startDate = now()->subDays(7)->format('Y-m-d');
            }
            if (!$endDate) {
                $endDate = now()->format('Y-m-d');
            }

            // Cache key for this request
            $cacheKey = "event_history_{$account->id}_{$startDate}_{$endDate}_" . md5(json_encode($filters));

            // Try to get from cache (5 minutes TTL)
            return Cache::remember($cacheKey, 300, function () use ($apiUrl, $apiToken, $startDate, $endDate, $filters) {
                return $this->callEventHistoryEndpoint($apiUrl, $apiToken, $startDate, $endDate, $filters);
            });

        } catch (Exception $e) {
            Log::error("Error fetching event history data: " . $e->getMessage(), [
                'account_id' => $account->id,
                'trace' => $e->getTraceAsString()
            ]);
            return $this->getEmptyData();
        }
    }

    /**
     * Call the getEventHistoryReport endpoint
     *
     * @param string $apiUrl
     * @param string $apiToken
     * @param string $startDate
     * @param string $endDate
     * @param array $filters
     * @return array
     */
    protected function callEventHistoryEndpoint(string $apiUrl, string $apiToken, string $startDate, string $endDate, array $filters = []): array
    {
        $endpoint = $apiUrl . '/json/getEventHistoryReport';

        $payload = [
            'sessionId' => $apiToken,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ];

        // Add optional filters
        if (!empty($filters)) {
            $payload = array_merge($payload, $filters);
        }

        Log::info("Calling TARGA TELEMATICS event history endpoint", [
            'url' => $endpoint,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'filters' => $filters,
        ]);

        $response = Http::timeout(30)
            ->post($endpoint, $payload);

        if ($response->failed()) {
            $statusCode = $response->status();
            $body = $response->body();
            
            Log::error("TARGA TELEMATICS API request failed", [
                'endpoint' => $endpoint,
                'status' => $statusCode,
                'response' => $body,
            ]);
            
            throw new Exception("API request failed with status {$statusCode}");
        }

        $data = $response->json();

        if (empty($data['eventHistoryReportEntries'])) {
            Log::info("No events found for the specified period");
            return $this->getEmptyData();
        }

        // Process and transform the event data
        return $this->transformEventData($data);
    }

    /**
     * Transform raw API data into a structured format
     *
     * @param array $rawData
     * @return array
     */
    protected function transformEventData(array $rawData): array
    {
        $events = $rawData['eventHistoryReportEntries'] ?? [];
        
        $transformedEvents = [];
        $eventsByType = [];
        $eventsByVehicle = [];
        $eventsByDate = [];

        foreach ($events as $event) {
            $transformedEvent = [
                'id' => $event['id'] ?? 0,
                'vehicle' => $event['vehicle'] ?? 'N/A',
                'plate_number' => $event['plateNumber'] ?? 'N/A',
                'reference' => $event['reference'] ?? $event['satId'] ?? '',
                'driver' => !empty($event['driver']) && trim($event['driver']) !== '' ? trim($event['driver']) : 'Non assigné',
                'event_time' => $event['eventTime'] ?? null,
                'event_name' => $event['eventName'] ?? 'Unknown',
                'event_type' => $event['event'] ?? 'UNKNOWN',
                'speed' => $event['speed'] ?? 0,
                'position' => [
                    'latitude' => $event['position']['latitude'] ?? null,
                    'longitude' => $event['position']['longitude'] ?? null,
                ],
                'address' => $this->formatAddress($event['address'] ?? []),
                'poi_name' => $event['poiName'] ?? '',
                'is_poi' => $event['isPOI'] === 'Y',
                'initiator' => !empty($event['initiator']) && trim($event['initiator']) !== '' ? trim($event['initiator']) : null,
                'additional_info' => $event['additionalInformation'] ?? null,
                'comment' => $event['comment'] ?? null,
                'creation_date' => $event['creationDateTime'] ?? null,
            ];

            $transformedEvents[] = $transformedEvent;

            // Group by event type
            $eventType = $transformedEvent['event_type'];
            if (!isset($eventsByType[$eventType])) {
                $eventsByType[$eventType] = [];
            }
            $eventsByType[$eventType][] = $transformedEvent;

            // Group by vehicle
            $vehicleRef = $transformedEvent['reference'];
            if (!isset($eventsByVehicle[$vehicleRef])) {
                $eventsByVehicle[$vehicleRef] = [
                    'vehicle' => $transformedEvent['vehicle'],
                    'plate_number' => $transformedEvent['plate_number'],
                    'events' => [],
                ];
            }
            $eventsByVehicle[$vehicleRef]['events'][] = $transformedEvent;

            // Group by date
            if ($transformedEvent['event_time']) {
                $date = date('Y-m-d', strtotime($transformedEvent['event_time']));
                if (!isset($eventsByDate[$date])) {
                    $eventsByDate[$date] = [];
                }
                $eventsByDate[$date][] = $transformedEvent;
            }
        }

        // Calculate statistics
        $stats = [
            'total_events' => count($transformedEvents),
            'events_by_type' => array_map('count', $eventsByType),
            'events_by_vehicle' => array_map(fn($v) => count($v['events']), $eventsByVehicle),
            'unique_vehicles' => count($eventsByVehicle),
            'date_range' => [
                'start' => !empty($transformedEvents) ? min(array_column($transformedEvents, 'event_time')) : null,
                'end' => !empty($transformedEvents) ? max(array_column($transformedEvents, 'event_time')) : null,
            ],
        ];

        return [
            'success' => true,
            'events' => $transformedEvents,
            'events_by_type' => $eventsByType,
            'events_by_vehicle' => $eventsByVehicle,
            'events_by_date' => $eventsByDate,
            'stats' => $stats,
            'raw_total' => count($events),
        ];
    }

    /**
     * Format address from API data
     *
     * @param array $address
     * @return string
     */
    protected function formatAddress(array $address): string
    {
        if (empty($address)) {
            return 'Adresse inconnue';
        }

        $parts = [];

        if (!empty($address['street'])) {
            $parts[] = $address['street'];
        }

        if (!empty($address['streetNumber'])) {
            $parts[] = $address['streetNumber'];
        }

        if (!empty($address['city'])) {
            $parts[] = $address['city'];
        }

        if (!empty($address['country'])) {
            $parts[] = $address['country'];
        }

        return !empty($parts) ? implode(', ', $parts) : 'Adresse inconnue';
    }

    /**
     * Get empty data structure
     *
     * @return array
     */
    protected function getEmptyData(): array
    {
        return [
            'success' => false,
            'events' => [],
            'events_by_type' => [],
            'events_by_vehicle' => [],
            'events_by_date' => [],
            'stats' => [
                'total_events' => 0,
                'events_by_type' => [],
                'events_by_vehicle' => [],
                'unique_vehicles' => 0,
                'date_range' => [
                    'start' => null,
                    'end' => null,
                ],
            ],
            'raw_total' => 0,
        ];
    }

    /**
     * Get events filtered by type
     *
     * @param Account $account
     * @param string $eventType
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getEventsByType(Account $account, string $eventType, ?string $startDate = null, ?string $endDate = null): array
    {
        $data = $this->fetchEventHistoryData($account, $startDate, $endDate);
        
        if (!$data['success']) {
            return $data;
        }

        $filteredEvents = array_filter($data['events'], function ($event) use ($eventType) {
            return $event['event_type'] === $eventType;
        });

        return [
            'success' => true,
            'event_type' => $eventType,
            'events' => array_values($filteredEvents),
            'total' => count($filteredEvents),
        ];
    }

    /**
     * Get events for a specific vehicle
     *
     * @param Account $account
     * @param string $vehicleReference
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getEventsByVehicle(Account $account, string $vehicleReference, ?string $startDate = null, ?string $endDate = null): array
    {
        $data = $this->fetchEventHistoryData($account, $startDate, $endDate);
        
        if (!$data['success']) {
            return $data;
        }

        return [
            'success' => true,
            'vehicle' => $data['events_by_vehicle'][$vehicleReference] ?? [
                'vehicle' => 'Unknown',
                'plate_number' => $vehicleReference,
                'events' => [],
            ],
        ];
    }
}
