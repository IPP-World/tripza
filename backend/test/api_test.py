from geopy.distance import distance
import requests
import requests
import json
import time

BASE_API_URL = 'https://raw-data-api0.hotosm.org/v1'

center_latitude =28.209534
center_longitude =83.985478
distance_in_meters = 10000
# Calculate the latitude and longitude offsets
latitude_offset = distance(meters=distance_in_meters).destination((center_latitude, center_longitude), 0).latitude - center_latitude
longitude_offset = distance(meters=distance_in_meters).destination((center_latitude, center_longitude), 90).longitude - center_longitude
print(latitude_offset, longitude_offset)
# Calculate the vertices of the rectangular polygon
vertices = [
    [center_longitude - longitude_offset, center_latitude + latitude_offset],
    [center_longitude + longitude_offset, center_latitude + latitude_offset],
    [center_longitude + longitude_offset, center_latitude - latitude_offset],
    [center_longitude - longitude_offset, center_latitude - latitude_offset],
    [center_longitude - longitude_offset, center_latitude + latitude_offset]
]
print(vertices)

headers = {'accept': "application/json","Content-Type": "application/json"}

def get_amenity(Emergency, Polygon_coordinate):
  BASE_URL= "https://raw-data-api0.hotosm.org/v1/snapshot/"
  payload = {
  "outputType": "geojson",
  "fileName": f"{Emergency} services",
  "geometry": {
    "type": "Polygon",
    "coordinates": [Polygon_coordinate]
  },
  "filters": {
    "tags": {
      "all_geometry": {
        "join_or": {
          "amenity": [Emergency]
        },
      }
    },
  },
  "geometryType": [
    "point",
  ]
}
# making call to the api to get boundary
  task_response = requests.post(url = BASE_URL, data = json.dumps(payload),headers=headers)

  # raise if any error occurs
  task_response.raise_for_status()
  result = task_response.json() # I will be on queue and it gives my unique task_id and link to track it
  task_track_url = result['track_link']
  stop_loop = False
  while not stop_loop:
    check_result = requests.get(url=f"{BASE_API_URL}{task_track_url}")
    check_result.raise_for_status()
    res=check_result.json() # status will tell current status of your task after it turns to success it will give result
    if res['status'] == 'SUCCESS'or res['status'] == 'FAILED':
      stop_loop= True
    time.sleep(1) # check each second
  return(res)

links=get_amenity('Hospital', vertices)
print(links)






