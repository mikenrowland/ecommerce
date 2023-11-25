import DBConnection from '../utils/dbConfig.js';

const collection = DBConnection().collection('orders');

async function getSellerOrders(seller, querySet) {
  const orders = await collection.aggregate(
    [
      { $match: { seller_id: seller.seller_id } },
      { $facet: { 
          results: [
            { $sort: {[querySet.sortBy]: -1 } },
            { $skip: querySet.offset },
            { $limit: querySet.limit },
            {
              $lookup: {
                from: 'products',
                localField: 'product_id',
                foreignField: 'product_id',
                as: 'product',
              }
            },
            {
              $project: {
                _id: 0, price: 1, product_id: 1,
                id: { $toString: '$order_item_id'},
                date: { $toString: '$shipping_limit_date' },
                product_category: { 
                  $cond: { 
                    if: { $ne: [{ $size: '$product' }, 0] }, 
                    then: { $arrayElemAt: ['$product.product_category_name', 0] }, 
                    else: null 
                  } 
                },
              }
            }
          ],
          total: [
            { $count: 'total' },
          ],
        }
      },
      { $unwind: '$total' },
      { $replaceRoot: { 
          newRoot: { data: '$results', total: '$total.total', limit: querySet.limit, offset: querySet.offset } 
        } 
      },
    ]
  ).toArray();

  return orders[0];
}

async function deleteItem(itemId) {
  return await collection.deleteOne({ order_id: itemId });
}

export default { getSellerOrders, deleteItem }
