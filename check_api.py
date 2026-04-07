import requests
import json

url = "https://anotherone-diggy.vercel.app/api/search?q=Iran%20attack%20USA"
try:
    response = requests.get(url, timeout=15)
    print("STATUS:", response.status_code)
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print("Raw text (not JSON):", response.text[:500])
except Exception as e:
    print(f"Error: {e}")
