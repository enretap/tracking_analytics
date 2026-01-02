<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\EventHistoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    protected EventHistoryService $eventHistoryService;

    public function __construct(EventHistoryService $eventHistoryService)
    {
        $this->eventHistoryService = $eventHistoryService;
    }

    /**
     * Get event history for the authenticated user's account
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
            'event_type' => 'nullable|string',
            'vehicle_reference' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user->account) {
            return response()->json([
                'success' => false,
                'error' => 'No account associated with this user'
            ], 403);
        }

        $account = $user->account;
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $eventType = $request->input('event_type');
        $vehicleReference = $request->input('vehicle_reference');

        try {
            // If filtering by event type
            if ($eventType) {
                $data = $this->eventHistoryService->getEventsByType(
                    $account,
                    $eventType,
                    $startDate,
                    $endDate
                );
            }
            // If filtering by vehicle
            elseif ($vehicleReference) {
                $data = $this->eventHistoryService->getEventsByVehicle(
                    $account,
                    $vehicleReference,
                    $startDate,
                    $endDate
                );
            }
            // Get all events
            else {
                $data = $this->eventHistoryService->fetchEventHistoryData(
                    $account,
                    $startDate,
                    $endDate
                );
            }

            return response()->json($data);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch event history',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get events by type
     *
     * @param Request $request
     * @param string $eventType
     * @return \Illuminate\Http\JsonResponse
     */
    public function byType(Request $request, string $eventType)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user->account) {
            return response()->json([
                'success' => false,
                'error' => 'No account associated with this user'
            ], 403);
        }

        try {
            $data = $this->eventHistoryService->getEventsByType(
                $user->account,
                strtoupper($eventType),
                $request->input('start_date'),
                $request->input('end_date')
            );

            return response()->json($data);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch events by type',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get events by vehicle
     *
     * @param Request $request
     * @param string $vehicleReference
     * @return \Illuminate\Http\JsonResponse
     */
    public function byVehicle(Request $request, string $vehicleReference)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user->account) {
            return response()->json([
                'success' => false,
                'error' => 'No account associated with this user'
            ], 403);
        }

        try {
            $data = $this->eventHistoryService->getEventsByVehicle(
                $user->account,
                $vehicleReference,
                $request->input('start_date'),
                $request->input('end_date')
            );

            return response()->json($data);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch events by vehicle',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get event statistics
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        if (!$user->account) {
            return response()->json([
                'success' => false,
                'error' => 'No account associated with this user'
            ], 403);
        }

        try {
            $data = $this->eventHistoryService->fetchEventHistoryData(
                $user->account,
                $request->input('start_date'),
                $request->input('end_date')
            );

            return response()->json([
                'success' => $data['success'],
                'stats' => $data['stats'] ?? null,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch event statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
