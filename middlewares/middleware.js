const speakeasy = require('speakeasy');

exports.requireToken = (req, res, next) => {
  const { token } = req.body; // Corrected property name to 'token'
  
  // Assuming that req.user.email contains the email of the authenticated user
  const user = users.find(u => u.email === req.user.email);
  
  // Verify the user's token
  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: 'base32',
    token,
    window: 1
  });

  if (!verified) {
    return res.status(401).send('Invalid token');
  }

  // Token is valid, proceed to the next middleware or route handler
  next();
};
