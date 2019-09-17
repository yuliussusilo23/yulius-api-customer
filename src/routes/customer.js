let CustomerModel = require('../models/customer.model')
let user = require('../models/user.model')
let express = require('express')
let jwt = require('jsonwebtoken')
let redis = require('redis')
let router = express.Router()
let clientRedis = redis.createClient(6379,'redisntw')

clientRedis.on('error',function(err){
    console.log('Error',err)
})

router.post('/yuliusCustomer/login', (req,res) => {
    if(!req.body){
        return res.status(400).send('Request body is required')
    }else{
        const {body} = req
        const {username} = body
        const {password} = body

        if(user.username===username && user.password===password){
            jwt.sign({user},'privatekey',{expiresIn:'1h'}, (err,token) => {
                if(err){
                    console.log(err)
                }else{
                    res.send(token)
                }
            })
        }else{
            res.status(400).send('username or password is wrong')
        }
    }
})

const checkToken = (req, res, next) => {
    const header = req.headers['auth'];

    if(typeof header !== 'undefined') {

        req.token = header;

        jwt.verify(req.token, 'privatekey', (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403)
            }
        })
        next()
    } else {
        res.sendStatus(403)
    }
}

router.post('/yuliusCustomer/insertCustomer',checkToken, (req,res) => {
    if(!req.body){
        return res.status(400).send('Request body is required')
    }else{
        let custModel = new CustomerModel(req.body)
        custModel.save()
        .then(doc => {
            if(!doc || doc.length === 0){
                return res.status(500).send('Insert Customer Failed')
            }
            clientRedis.set(req.body.idNumber,JSON.stringify(doc),redis.print)
            res.status(201).send('Insert Customer Success')
        })
        .catch(err => {
            res.status(500).json('Insert Customer Failed')
        })
    }
})

router.post('/yuliusCustomer/deleteCustomerbyIdNumber',checkToken, (req,res) => {
    if(!req.body.idNumber){
        return res.status(400).send('IdNumber is required')
    }else{
        CustomerModel.findOneAndDelete({
            idNumber : req.body.idNumber
        })
        .then(doc => {
            if(!doc || doc.length === 0){
                return res.status(500).send("Customer not Find")
            }
            clientRedis.del(req.body.idNumber)
            res.status(201).send('Detele Customer Success')
        })
        .catch(err => {
            console.error(err)
            res.status(500).send('Detele Customer Failed')
        })
    }
})

router.post('/yuliusCustomer/updateCustomer',checkToken, (req,res) => {
    if(!req.body.idNumber){
        return res.status(400).send('IdNumber is required')
    }else{
        CustomerModel.findOneAndUpdate({
            idNumber : req.body.idNumber
        },req.body,{
            new : true
        })
        .then(doc => {
            if(!doc || doc.length === 0){
                return res.status(500).send("Customer not Find")
            }
            clientRedis.set(req.body.idNumber,JSON.stringify(doc),redis.print)
            res.status(201).send('Update Customer Success')
        })
        .catch(err => {
            console.error(err)
            res.status(500).send('Update Customer Failed')
        })
    }
})

router.post('/yuliusCustomer/getCustomerbyAccountNumber',checkToken, (req,res) => {
    if(!req.body.accountNumber){
        return res.status(400).send('AccountNumber is required')
    }else{
        CustomerModel.findOne({
            accountNumber : req.body.accountNumber
        })
        .then(doc => {
            if(!doc || doc.length === 0){
                return res.status(500).send("Customer not Find")
            }
            res.json(doc)
        })
        .catch(err => {
            console.error(err)
            res.status(500).send('Get Customer Failed')
        })    
    }
})

router.post('/yuliusCustomer/getCustomerbyIdNumber',checkToken, (req,res) => {
    if(!req.body.idNumber){
        return res.status(400).send('IdNumber is required')
    }else{
        clientRedis.get(req.body.idNumber, (error, result) => {
            if(result){
                res.json(JSON.parse(result))
            }else{
                CustomerModel.findOne({
                    idNumber : req.body.idNumber
                })
                .then(doc => {
                    if(!doc || doc.length === 0){
                        return res.status(500).send("Customer not Find")
                    }
                    clientRedis.set(req.body.idNumber,JSON.stringify(doc),redis.print)
                    res.json(doc)
                })
                .catch(err => {
                    console.error(err)
                    res.status(500).send('Get Customer Failed')
                })
            }
        })
    }
})

module.exports = router