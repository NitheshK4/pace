<?php

return [
    'api_key'  => env('PACE_API_KEY', 'pace_demo_key'),
    'endpoint' => env('PACE_ENDPOINT', 'http://localhost:8000'),
    'timeout'  => (int)env('PACE_TIMEOUT', 3),
];
