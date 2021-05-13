const CustomerModel = require('../models/customer.module');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const customerModule = require('../models/customer.module');
dotenv.config();

/******************************************************************************
 *                              Customer Controller
 ******************************************************************************/
class UserController {

    getAllUsers = async(req, res, next) => {
        let userList = await CustomerModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'Users not found');
        }

        userList = userList.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(userList);
    };

    getUserById = async(req, res, next) => {
        const user = await CustomerModel.findOne({ email: req.query.cus_email });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    createUser = async(req, res, next) => {
        var datetime = new Date().toISOString()
        var date = datetime
        this.checkValidation(req);

        req.body.created_on = date
        req.body.created_by = req.query.email
        req.body.last_up_by = req.query.email
        req.body.last_up_on = date

        const result = await customerModule.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('User was created!');
    };

    updateUser = async(req, res, next) => {
        var datetime = new Date().toISOString()
        var date = datetime
        this.checkValidation(req);

        req.body.last_up_by = req.query.email
        req.body.last_up_on = date

        const {...restOfUpdates } = req.body;
        // do the update query and get the result
        // it can be partial edit
        const result = await customerModule.update(restOfUpdates, req.query.customer_email);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteUser = async(req, res, next) => {

        req.body.Active = 0
        const {...restOfUpdates } = req.body;
        // do the update query and get the result
        // it can be partial edit
        const result = await customerModule.update(restOfUpdates, req.query.customer_email);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User deleted successfully' : 'Delete faild';

        res.send({ message, info });
    };


    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;