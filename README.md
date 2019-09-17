# yulius-api-customer
Yulius API Customer

create network yulius-workspace_mynetwork
running docker-compose up --build

TASK 2

API generate token
localhost:9011/yuliusCustomer/login
Body : {"username": "user123","password": "123456"}
API insert customer
localhost:9011/yuliusCustomer/insertCustomer
Header : {auth : <Hasil token nomor1>}
Body : {"userName" : "Yulius4","accountNumber" : 112277,"idNumber" : 123450,"emailAddress" : "susilo.yulius@yahoo.com"}
API update customer
localhost:9011/yuliusCustomer/updateCustomer
Header : {auth : <Hasil token nomor1>}
Body : {"userName" : "Yulius9","accountNumber" : 332211,"idNumber" : 123450,"emailAddress" : "susilo.yulius@yahoo.com"}
API get customer by account number
localhost:9011/yuliusCustomer/getCustomerbyAccountNumber
Header : {auth : <Hasil token nomor1>}
Body : {"accountNumber" :332211}
API get customer by id number
localhost:9011/yuliusCustomer/getCustomerbyIdNumber
Header : {auth : <Hasil token nomor1>}
Body : {"idNumber" : 123450}
API delete customer
localhost:9011/yuliusCustomer/deleteCustomerbyIdNumber
Header : {auth : <Hasil token nomor1>}
Body : {"idNumber" : 123450}
Database	: yuliusdb
Schema	: CustomerSchema
Structure	: userName (String)
  accountNumber (Number)
  idNumber (Number, unqiue, required)
  emailAddress (String)

App implement node.js, mongodb, authentication token (jwt), redis, and deploy to docker

