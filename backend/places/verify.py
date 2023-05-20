from math import radians, sin, cos, sqrt, atan2

def haversine_distance(lat1, lon1, lat2, lon2):
    lat2 = float(lat2) # Convert coordinates from degrees to radians
    lon2 = float(lon2) # Convert coordinates from degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Earth's radius in meters
    radius = 6371000  # meters

    # Calculate the differences between latitudes and longitudes
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine formula
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    # Calculate the distance
    distance = radius * c

    return distance

# Example usage
lat1 = 28.390591999999998  # latitude of point 1
lon1 = 83.93487197222223  # longitude of point 1

lat2 = 28.390813  # latitude of point 2
lon2 = 83.935271 # longitude of point 2

distance = haversine_distance(lat1, lon1, lat2, lon2)

# Check if the distance is within 300 meters
if distance <= 300:
    is_verified=True
else:
    is_verified=False