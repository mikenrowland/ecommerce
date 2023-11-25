import orderService from '../services/orderService.js';

const getAllOrders = async(req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  if (limit > 100) {
    return res.status(400).send({ message: 'Limit should not exceed 100.'});
  }
  
  const offset = parseInt(req.query.offset) || 0;
  const sortField = req.query.sortBy === 'price' ? 'price' : 'shipping_limit_date';

  const querySet = {
    limit: limit,
    offset: offset,
    sortBy: sortField
  }

  const orders = await orderService.getSellerOrders(req.loggedInUser, querySet);

  res.status(200).json( orders );
}

const deleteOrderItem = async(req, res) => {
  const orderId = req.params.id;
  const result = await orderService.deleteItem(orderId);

  if (!result.deletedCount) {
    return res.status(404).send({ message: 'No document matches the given ID.'});
  }

  res.status(200).send({ message: `${result.deletedCount} document with ID ${orderId} was successfully deleted.`});
}

export { getAllOrders, deleteOrderItem }
