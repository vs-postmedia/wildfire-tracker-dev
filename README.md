 # wildfire-tracker-dev
Development build for the wildfire tracker.

Based off of current fire locations found at: `https://catalogue.data.gov.bc.ca/dataset/fire-locations-current`

Evacs & alerts data: `https://catalogue.data.gov.bc.ca/dataset/evacuation-orders-and-alerts#edc-pow` has to be manually downloaded, simplified &converted to geojson in mapshaper, then uploded to mapbox studio into `Evacs and alerts` tileset

### 
Data is pulled from Heroku app – `fast-forest-46102` – that runs once an hour. Provincial wildfire data is updated daily at midnight.




###
EMBED
[protected-iframe info="https://vs-postmedia.github.io/wildfire-tracker-dev/" frameborder="0" height="700" scrolling="yes" width="no"]
