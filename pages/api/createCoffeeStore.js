const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY })
.base(process.env.AIRTABLE_BASE_KEY);

const table = base('coffee-stores');

console.log({table});

const createCoffeeStore = (req, res) => {
    if (req.method === 'POST') {
        res.status(200).json(req.body.text);
    }
    else {
        res.status(200).json('Get');
    }
}

export default createCoffeeStore;