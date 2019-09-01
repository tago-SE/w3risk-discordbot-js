// Requirements
const MongoClient = require('mongodb').MongoClient;
const secret = require("../.secret.json");  
const config = require("../config.json");  
// Constants
const url = "mongodb://" + secret.db.host + ":" + secret.db.port + "/" + secret.db.name;
const dbName = secret.db.name;
const collectionKey = 'replays';

module.exports = {

    getReplayByGameId(gameId) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).findOne({id: gameId}, function (err, res) {
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

    updateRankedById(gameId, flag) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).updateOne({id: gameId}, 
                        {
                            $set: { rankedMatch: flag },
                        },
                        {upsert: true}
                    );
                    resolve(true);
                }
            });
        });
    },
}