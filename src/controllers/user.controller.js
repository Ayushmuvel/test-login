const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {

    userLogin = async(req, res, next) => {
        this.checkValidation(req);

        this.hashPassword(req)

        const { email, password: pass } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user || user.Active == 0) {
            throw new HttpException(401, 'Unable to login!');
        }

        // console.log(this.hashPassword(req))
        const isMatch = await bcrypt.compare(pass, user.password);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign({ user_id: user.email.toString() }, secretKey, {
            expiresIn: '24h'
        });

        const { password, ...userWithoutPassword } = user;

        res.send({...userWithoutPassword, token });
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    // hash password if it exists
    hashPassword = async(req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
            console.log(req.body.password)
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;