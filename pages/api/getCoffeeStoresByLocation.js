import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
    //Configure latLong and limit

    try {
        const { latLong, limit } = req.query;
        const response = await fetchCoffeeStores(latLong, limit);
        //Return
        res.status(200).json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json( { message: 'Something went wrong' });
    }
}

export default getCoffeeStoresByLocation;