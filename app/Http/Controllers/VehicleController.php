<?php

namespace App\Http\Controllers;

use App\Services\VehicleService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    protected VehicleService $vehicleService;

    public function __construct(VehicleService $vehicleService)
    {
        $this->vehicleService = $vehicleService;
    }

    /**
     * Get all vehicles for the authenticated user's account
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        $vehicles = $this->vehicleService->getAllVehicles($user);

        return response()->json([
            'success' => true,
            'data' => $vehicles,
            'count' => count($vehicles),
        ]);
    }

    /**
     * Render the vehicles page with Inertia
     *
     * @param Request $request
     * @return Response
     */
    public function page(Request $request): Response
    {
        $user = $request->user();
        $vehicles = $user ? $this->vehicleService->getAllVehicles($user) : [];

        return Inertia::render('Vehicles', [
            'vehicles' => $vehicles,
        ]);
    }
}
