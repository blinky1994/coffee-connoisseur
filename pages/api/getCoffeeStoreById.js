import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
    if (req.method === 'GET') {
        const { id } = req.query;
        try {
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    res.json(records);
                } else {
                    res.json({})
                }
            } else {
                res.status(400).json({ message: 'Id is missing' })
            }
    
        } catch (error) {
            console.error(error);
            res.status(500).json( { message: 'Something went wrong' });
        }
    }
} 

export default getCoffeeStoreById;