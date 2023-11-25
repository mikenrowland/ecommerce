import sellerService from '../services/sellerService.js';

const updateAccount = async(req, res) => {
  const { city, state } = req.body;
  if (!city && !state) {
    return res.status(400).send({ message: 'Seller\'s city and/or state field must be filled.'})
  }

  const result = await sellerService.updateSellerAccount(req.loggedInUser, { city, state });

  res.status(200).send({ message: 'Seller\'s account was successfully updated.', data: result})
}

export { updateAccount }
