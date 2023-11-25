import DBConnection from '../utils/dbConfig.js';

const collection = DBConnection().collection('sellers');

async function getSeller(sellerId) {
  return collection.findOne({seller_id: sellerId});
}

async function updateSellerAccount(seller, data) {
  const filter = { seller_id: seller.seller_id };
  
  const updateData = { $set: { seller_city: data.city, seller_state: data.state }};
  if (!updateData.$set.seller_city) {
    delete updateData.$set.seller_city;
  }

  if (!updateData.$set.seller_state) {
    delete updateData.$set.seller_state;
  }

  const options = { 
    returnDocument: 'after', 
    projection: { _id: 0, seller_id: 0, seller_zip_code_prefix: 0 } 
  };

  const result = await collection.findOneAndUpdate(filter, updateData, options);

  return result;
}

export default { getSeller, updateSellerAccount }
