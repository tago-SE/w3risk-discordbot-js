// Requirements
const MongoClient = require('mongodb').MongoClient;
const secret = require("../.secret.json");  
// Constants
const url = "mongodb://" + secret.db.host + ":" + secret.db.port + "/" + secret.db.name;
const dbName = secret.db.name;
const collectionKey = 'admins';

module.exports = {

    /**
     * Returns all bot admins stored in the database as an array.  
     */
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

    /**
     * Queries the database for a admin with the provided name. 
     * @param {*} adminName target name
     */
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

    /**
     * Inserts a admin to the list of admins
     * @param {*} adminName 
     */
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

    /**
     * Removes a admin from the list of admins
     * @param {*} adminName name of admin to be removed
     */
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