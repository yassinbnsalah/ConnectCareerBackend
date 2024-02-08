const User = require("../models/user");

const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const Authentificaiton = async(req, res) =>{
    try {
        const { email, password } = req.body;
    
        // Find the user by username
        const user = await User.findOne({ email }).populate('entreprise');
        console.log(email);
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        // Check if the provided password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.Hpassword);
    
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    
        res.json({ token,user});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in' });
      }
}
module.exports = Authentificaiton;
  