 # wildfire-tracker-dev
Development build for the wildfire tracker.

Based off of current fire locations found at: `https://catalogue.data.gov.bc.ca/dataset/fire-locations-current`

Built with create-react-app.

###
SCRIPTS

`get-current-fires`
Downloads the current fire shapefile from `https://pub.data.gov.bc.ca/datasets/2790e3f7-6395-4230-8545-04efb5a18800/prot_current_fire_points.zip`
Unzips & converts to geojson, adds date in human-readable format then uploads to a Google Sheet `https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing` for access from the wildfire-tracker app.

Script is hosted as Heroku app – `fast-forest-46102` – & runs every hour.


`active-fire-scraper`
Scrapes fire details from the relevant fire page, based on the FIRE_ID found in the `get-current-fires`. Data for each fire is scraped and stored in a separate worksheet in Google Sheets.



`fire-summary-scraper` <-- UNUSED
Scrapes the fire summary table at `http://bcfireinfo.for.gov.bc.ca/hprScripts/WildfireNews/Statistics.asp`, strips out totals then saves the data to a Google Sheet.






###
DEV TO DO

1. stat-boxes as toggles for fire components
2. add "fires near me" search box (by postal?)
