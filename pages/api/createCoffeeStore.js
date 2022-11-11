import { getMinifiedRecords, table, findRecordByFilter }
from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
    if (req.method === 'POST') {
        const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

        try {
            // Find a record
            if (id) {
                const records = await findRecordByFilter(id);
        
                if (records.length !== 0) {
                    res.json(records);
                } else {
                    // Create a record
                    if (name) {
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighbourhood,
                                    voting,
                                    imgUrl
                                }
                            }
                        ]);
        
                        const records = getMinifiedRecords(createRecords);
                        res.json({ records })
                    } else {
                        res.status(400).json({ message: 'Name is missing'});
                    }
                }
            } else {
                res.status(400).json({ message: 'Id is missing'});
            }

        } catch (error) {
            console.error('Error creating or finding store: ', error);
            res.status(500).json({ message: 'Error creating or finding store: ', error})
        }
    }
}

export default createCoffeeStore;