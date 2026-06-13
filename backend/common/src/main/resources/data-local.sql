-- Demo seed data for local H2 profile (idempotent MERGE)
MERGE INTO hospitals (id, name, lat, lng, total_icu_beds, available_icu_beds, specializations, phone, current_load_pct, updated_at)
KEY(id) VALUES
('c7d92ea3-66e1-52cf-a149-8db02ea83615', 'LifeLine Cardiac Institute', 12.9765, 77.5993, 32, 12, 'cardiac,general', '+91-80-4000-1001', 0.44, CURRENT_TIMESTAMP),
('b4f2e10c-5bd0-5743-8ead-c52fe8b692a5', 'City Trauma Center', 12.9652, 77.608, 24, 7, 'trauma,general', '+91-80-4000-1002', 0.62, CURRENT_TIMESTAMP),
('eecafa82-b9b1-5871-9be6-53c3fd607cff', 'Metro Burns & Critical Care', 12.9871, 77.5854, 18, 5, 'burns,trauma', '+91-80-4000-1003', 0.52, CURRENT_TIMESTAMP);

MERGE INTO ambulances (id, vehicle_number, current_lat, current_lng, status, driver_name, driver_phone, equipment_level, updated_at)
KEY(id) VALUES
('86d3df84-47ea-518f-b09e-c5b428bd1445', 'KA-SEG-1001', 12.94, 77.56, 'AVAILABLE', 'Driver A', '+91-90000-1000', 'BASIC', CURRENT_TIMESTAMP),
('79823909-7701-5378-b093-9c8e462c6072', 'KA-SEG-1002', 12.954, 77.588, 'AVAILABLE', 'Driver B', '+91-90000-1001', 'ALS', CURRENT_TIMESTAMP),
('c9ee54f4-fe28-5935-b490-303306ad4e7f', 'KA-SEG-1003', 12.968, 77.616, 'AVAILABLE', 'Driver C', '+91-90000-1002', 'ICU', CURRENT_TIMESTAMP),
('629ac48e-b1b0-506a-9099-ae1f0098c1d1', 'KA-SEG-1008', 12.974, 77.6, 'AVAILABLE', 'Driver H', '+91-90000-1007', 'ICU', CURRENT_TIMESTAMP),
('47e6d61b-47c8-5041-913e-7b952e3af8a6', 'KA-SEG-1013', 12.98, 77.584, 'AVAILABLE', 'Driver M', '+91-90000-1012', 'ICU', CURRENT_TIMESTAMP);

MERGE INTO volunteers (id, name, phone, lat, lng, is_available, skills)
KEY(id) VALUES
('7ee01b4f-d2df-58ce-b415-da8d51a6867a', 'Asha Rao', '+91-99000-0001', 12.9732, 77.5964, TRUE, 'cpr,bleeding'),
('8b85feaf-5570-557a-ac3a-7556d2087b72', 'Rahul Mehta', '+91-99000-0002', 12.969, 77.591, TRUE, 'fracture,bleeding'),
('9c0a768e-03b8-58c6-a501-19bd9144ff5a', 'Priya Nair', '+91-99000-0003', 12.9812, 77.6019, TRUE, 'cpr,burns'),
('c4d40993-7ea7-5041-9ba8-0d09f2442300', 'Vikram Singh', '+91-99000-0006', 12.9902, 77.5904, TRUE, 'cpr,cardiac');

MERGE INTO traffic_signals (id, lat, lng, road_segment, current_state)
KEY(id) VALUES
('de41bfca-9ea5-5626-981e-ba057bd553f1', 12.955, 77.575, 'Grid Segment 1-1', 'RED'),
('02a91809-c394-5225-b235-8afef0cca8f2', 12.955, 77.584, 'Grid Segment 1-2', 'RED'),
('c604e3c5-7ae6-5108-98b0-4936983eb591', 12.955, 77.593, 'Grid Segment 1-3', 'RED'),
('b98a238d-4096-5f52-ab60-94e391d02412', 12.97, 77.584, 'Grid Segment 3-2', 'RED'),
('152299ba-c52e-51e9-ba9e-1a60bf71f283', 12.97, 77.593, 'Grid Segment 3-3', 'RED');
