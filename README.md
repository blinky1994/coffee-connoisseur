# Coffee-Connoisseur
Coffee store locater built with NextJS and Airtable. Uses the Foursquare API to get location data.

![coffee](https://user-images.githubusercontent.com/56903269/210049174-da4db5a2-4e92-4ed3-b587-eaa5efe64a3d.png)

# Getting locations
The initial default data is generated using Foursquare's API by using a chosen address for the latitude and longtitude. For the store nearby feature, 
it uses the `navigator.geolocation` to obtain the current device location which is then passed to Foursquare's API to get the location like the default steps.
