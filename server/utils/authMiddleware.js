import sellerService from '../services/sellerService.js';

const authMiddleWare = async (req, res, next) => {
  try {
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    const user = await sellerService.getSeller(username);

    // Checks if credentials are valid
    if (user && user.seller_zip_code_prefix === password) {
      req.loggedInUser = user;
      next();
    } else {
      // Unauthorized response for invalid credentials
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

export default authMiddleWare
