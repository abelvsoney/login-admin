var db=require('../config/connection')
var collection = require('../config/collections');
const collections = require('../config/collections');
var objectId = require('mongodb').ObjectId
var bcrypt = require('bcrypt')

module.exports = {

    addProduct:(product, callback) => {
        // console.log(product);
        db.get().collection(collection.USERS_COLLECTION).insertOne(product).then((data) => {
            // console.log(data);
            callback(data)
        })
    },
    getAllProducts:() => {
        return new Promise (async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            //console.log(users)
            resolve(users)
        })
    },
    deleteUser:(userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response) => {
                // console.log(response);
                resolve(response)
            })
        })
    },
    getUserDetails:(userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USERS_COLLECTION).findOne({_id:objectId(userId)}).then((user) => {
                resolve (user)
            })
        })
    },
    updateUser:(userId, userDetails) => {
        // console.log(userDetails)
        return new Promise(async(resolve, reject) => {
            // console.log(id);
            // var isThere = await db.get().collection(collection.USERS_COLLECTION).findOne({ Email: userDetails.Email }, {_id:{$ne:objectId(userId)}})
            // // console.log("is there\n"+isThere);
            // if (isThere == null) {
            //     console.log(await db.get().collection(collections.USERS_COLLECTION).findOne({_id:objectId(userId)}))
            //     console.log("chnaged");
                userDetails.Password = await bcrypt.hash(userDetails.Password, 10); 
                db.get().collection(collection.USERS_COLLECTION)
                    .updateOne({Email:userDetails.Email}, {
                        $set: {
                            Name: userDetails.Name,
                            // Email:userDetails.Email,
                            Password: userDetails.Password
                        }
                    }).then((response) => {
                        resolve()
                    })
                
            // } else {
            //     console.log("Cant update user")
            //     resolve(false);
            // }
        })
    }

}