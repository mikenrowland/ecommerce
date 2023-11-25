import { Router } from 'express';
const router = Router();
import { getAllOrders, deleteOrderItem } from '../controllers/orderController.js';
import { updateAccount } from '../controllers/sellerController.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/order_items', getAllOrders);

router.delete('/order_items/:id', deleteOrderItem);

router.put('/account', updateAccount);

export default router;
