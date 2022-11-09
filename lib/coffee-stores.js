const getUrlForCoffeeStores = (latLong, query, limit) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

export const fetchCoffeeStores = async () => {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.FOURSQUARE_API_KEY
        }
      };
      
      const response =
        await fetch(
          getUrlForCoffeeStores(
            '1.3570143677880628,103.89183249942322',
            'coffee',
            10,
            ),
          options);

      const data = await response.json();

      console.log(data);
      return data.results;
}


