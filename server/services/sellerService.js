import DBConnection from '../utils/dbConfig.js';

const collection = DBConnection().collection('sellers');

async function getSeller(sellerId) {
  return collection.findOne({seller_id: sellerId});
}

export default { getSeller }
