const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 4000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.jqkkwtg.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
    console.error("MongoDB connection error:", err);
});

const registrationSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        // Add password hashing here (e.g., using bcrypt)
        const existingUser = await Registration.findOne({email:email});
        if(!existingUser){
        const registrationData = new Registration({
            firstname,
            lastname,
            email,
            password,
        });

        await registrationData.save();
        res.redirect("/success");
    } 
    else{
        alert("User already exists");
        res.redirect("/error");
    }
}catch (error) {
        console.error("Registration error:", error);
        res.status(500).redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/frontend/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/frontend/error.html");
});

app.use(express.static('frontend'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
