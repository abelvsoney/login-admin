var db=require('../config/connection')
var collection = require('../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('express')

module.exports={
    doSignup:function(userData) {
        return new Promise(async function (resolve, reject) {
            var isThere = await db.get().collection(collection.USERS_COLLECTION).findOne({ Email: userData.Email })
            if (isThere) {
                resolve(false)
            } else {
                userData.Password = await bcrypt.hash(userData.Password, 10);
                db.get().collection(collection.USERS_COLLECTION).insertOne(userData).then((data) => {
                    // console.log(data);
                    resolve(data)
                })
            }
        })    
    },
    doLogin:function(userData) {
        return new Promise (async (resolve, reject) => {
            let loginStatus=false
            let user = await db.get().collection(collection.USERS_COLLECTION).findOne({Email:userData.Email})
            if(user) {
                // console.log(user.Password);
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if(status){
                        console.log("login success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login failed");
                        resolve({status})
                    }
                })
            }else{
                console.log("no user");
                resolve(false)
            }
        })
    }
}