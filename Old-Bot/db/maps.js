const MongoClient = require('mongodb').MongoClient;
const secret = require("../.secret.json");  

const url = "mongodb://" + secret.db.host + ":" + secret.db.port + "/" + secret.db.name;
const dbName = secret.db.name;
const collectionKey = 'maps';

module.exports = class Maps {

    static insertMap(map) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).updateOne({dbName: map.toLowerCase()}, 
                        {
                            $set: { name: map, dbName: map.toLowerCase() },
                        },
                        {upsert: true}
                    );
                    db.close();
                    resolve(true);
                }
            });
        });
    }

    static deleteMap(map) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).deleteOne({dbName: map.toLowerCase()}, function(err, obj) {
                        if (err) 
                            reject(err);
                        db.close();
                        resolve(obj);
                    });
                }
            });
        });
    }

    static getMap(map) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).findOne({dbName: map.toLowerCase()}, function (err, res) {
                        if (err)
                            reject(err);
                        else  
                            resolve(res);
                        db.close();
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    }

    static addVersion(map, ver) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).updateOne({dbName: map.toLowerCase()}, 
                        {
                            $addToSet: { versions: ver },
                        }
                    );
                    db.close();
                    resolve(true);
                }
            });
        });
    }

    static deleteVersion(map, ver) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).updateOne({dbName: map.toLowerCase()}, 
                        {
                            $pull: { versions: ver },
                        }
                    );
                    db.close();
                    resolve(true);
                }
            });
        });
    }


}