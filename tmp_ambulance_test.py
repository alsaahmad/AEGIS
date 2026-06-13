import json
import urllib.request
import urllib.error

url = 'http://127.0.0.1:8082/api/v1/ambulances/assign'
payload = json.dumps({
    'emergency_id': 'b4d64d99-d380-4797-a0b2-65b88b177a32',
    'severity': 'CRITICAL',
    'location_lat': 12.9716,
    'location_lng': 77.5946,
    'injury_type': 'cardiac arrest'
}).encode('utf-8')
req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        print('STATUS', r.status)
        print(r.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP ERROR', e.code)
    try:
        print(e.read().decode('utf-8'))
    except Exception as inner:
        print('BODY READ ERROR', inner)
except Exception as e:
    print('ERROR', e)
