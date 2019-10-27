
const MongoClient = require('mongodb').MongoClient;
const secret = require("../.secret.json");  
const config = require("../config.json");  
const Replay = require("../models/replay");

const url = "mongodb://" + secret.db.host + ":" + secret.db.port + "/" + secret.db.name;
const dbName = secret.db.name;
const collectionKey = 'replays';


module.exports = {

    /**
     * Inserts a replay object into the database
     * @param {*} replay 
     */
    insert(replay) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).insertOne(replay, function(err, res) {
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
     * 
     * @param {int} id 
     * @param {int} error 
     */
    setReplayFailureFlag(id, error) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).updateOne({id: id}, 
                        {
                            $set: { 
                                id: id, error: error
                            } 
                        },
                        {upsert: true},
                    ); 
                }
                if (db !== null) 
                    db.close();
                resolve();
            });
        });
    },

    /**
     * Queries the database for a replay with a matching replay id. 
     * @param {*} gameId replay id
     */
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

    /**
     * Updates a replays ranked status to the provided flag
     * @param {*} gameId the replay id
     * @param {*} flag boolean flag
     */
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

    /**
     *  
     * @param {*} search 
     */
    searchPlayerHistory(search) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find({ players: {
                        $elemMatch: {name : {$regex: new RegExp('^'+ search + '$', "i") }} 
                    }
                    }).limit(config.games.limit).toArray(function (err, res) {
                        if (err) {
                            console.log(err);
                            resolve([]);
                        }                       
                        resolve(res);
                    });
                }
            });
        });
    },

    getPlayerReplays(name) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find({ players: {$elemMatch: {name : {$regex: new RegExp('^'+ name + '$', "i")} } }
                    }).toArray(function (err, res) {
                        if (err) {
                            console.log(err);
                            resolve([]);
                        }                       
                        resolve(res);
                    });
                }
            });
        });
    }
    
}