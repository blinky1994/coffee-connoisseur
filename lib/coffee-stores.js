import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

export const getListOfCoffeeStorePhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'coffee shop',
        page: 1,
        perPage: 36,
      });

    return photos?.response?.results.map(result => result.urls['small']);
}

export const fetchCoffeeStores = async (latLong = '1.3026012719828184,103.82950661183509', limit = 10) => {
    const photos = await getListOfCoffeeStorePhotos();

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
      };
      
      const response =
        await fetch(
          getUrlForCoffeeStores(
            latLong,
            'coffee',
            limit,
            ),
          options);

      const data = await response.json();

      return data.results.map((result, index) => {
        return {
            id: result.fsq_id,
            name: result.name,
            address: result.location.formatted_address,
            neighbourhood: result.location.post_town,
            imgUrl: photos?.length > 0 ? photos[index] : null,
            voting: 0
        }
      });
}


