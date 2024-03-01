import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {generateToken} from "../services/auth-service.js";
import User from "../models/user-model.js";

export const register = async (req, res) => {
    try {
        const {firstname, lastname, email, password, birthdate, accept} =
            req.body;

        if (!(firstname && lastname && email && password && birthdate)) {
            return res.status(400).json({message: "All fields are required"});
        }

        if (!accept) {
            return res.status(400).json({message: "You must accept the terms and conditions"});
        }

        const hashedPassword = await bcrypt.hash(
            password,
            await bcrypt.genSalt(10)
        );

        const existingUser = await User.findOne({
            where: {email},
        });

        if (existingUser) {
            return res.status(409).json({message: `Email already taken`});
        }

        const authToken = generateToken();

        let newUser;
        try {
            newUser = await User.create({
                firstname,
                lastname,
                email,
                birthdate: new Date(birthdate),
                password: hashedPassword,
                authToken,
            })
        } catch (error) {
            res.sendStatus(500)
        }


        const payload = {
            userId: newUser.id,
        };

        const options = {
            expiresIn: "12h",
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, options);

        res.status(201).json({
            ...JSON.parse(JSON.stringify(newUser)),
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: `An error occurred while creating the user : ${error.message}`,
        });
    }
};


export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) return res.status(401).json({message: "No user found with this email"});

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid password"});
        }

        if (!user.isValidate) {
            return res.status(401).json({message: "Email not confirmed"});
        }

        const payload = {
            userId: user.id,
        };

        const options = {
            expiresIn: "12h",
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, options);

        const userWithToken = {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            token,
        };

        delete userWithToken.password;

        res.json(userWithToken);
    } catch (error) {
        res.status(500).json({
            message: `An error occurred during login: ${error.message}`,
        });
    }
};

export const checkEmail = async (req, res) => {
    try {
        const {email} = req.query;

        const user = await User.findOne({
            where: {email},
        });

        if (!user) return res.status(404).json({message: "No user found with this email"});
        return res.status(409).json({message: `Email already taken`});
    } catch (error) {
        res.status(500).json({
            message: `An error occurred while checking the email : ${error.message}`,
        });
    }
};
