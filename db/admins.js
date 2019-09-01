// Requirements
const MongoClient = require('mongodb').MongoClient;
const secret = require("../.secret.json");  
const config = require("../config.json");  
// Constants
const url = "mongodb://" + secret.db.host + ":" + secret.db.port + "/" + secret.db.name;
const dbName = secret.db.name;
const collectionKey = 'admins';

module.exports = {

    getAll() {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find().toArray(function (err, res) {
                        if (err)
                            reject(err);
                        else  
                            resolve(res);
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    },

    getAdmin(adminName) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).findOne({name: adminName.toLowerCase()}, function (err, res) {
                        if (err)
                            reject(err);
                        else  
                            resolve(res);
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    },

    insertAdmin(adminName) {
        adminName = adminName.toLowerCase();
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).updateOne({name: adminName}, 
                        {
                            $set: { name: adminName },
                        },
                        {upsert: true}
                    );
                    resolve(true);
                }
            });
        });
    },

    deleteAdmin(adminName) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).deleteOne({name: adminName.toLowerCase()}, function(err, obj) {
                        if (err) 
                            reject(err);
                        db.close();
                        resolve(obj);
                    });
                }
            });
        });
    }
}