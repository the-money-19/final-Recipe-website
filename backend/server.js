const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
app.use(express.json());

// home page api
app.get('/', (req, res) => {
    res.send('<h1 align=center>Hello World</h1>');
});

// register page api
app.post('/register', async (req, res) => {
    try {
        console.log('Incoming request body:', req.body);
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.json({ message: "User created successfully" });
        console.log('User registered successfully');
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "An error occurred during registration" });
    }
});

// login page api
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try{
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "User not found" });
        }
        res.json({ message: "User logged in successfully" ,username:user.username}); 
    }

    catch(err){
        console.log(err);
    }
})
   

mongoose.connect(process.env.MONGO_URL).then(
    () => console.log("db connection successful")
).catch((err) => console.log(err));

app.listen(PORT, (err) => {
    if (err) {
        console.log('error');
    }
    console.log('server is running on port :', PORT);
});
