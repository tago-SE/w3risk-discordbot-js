// Requirements
const MongoClient = require('mongodb').MongoClient;
const secret = require("../.secret.json");  
const config = require("../config.json");  
const Replay = require("../models/replay");
const BnetUser = require("../models/user");
//const Users = require("../db/users");
// Constants
const url = "mongodb://" + secret.db.host + ":" + secret.db.port + "/" + secret.db.name;
const dbName = secret.db.name;
const rankedLimit = config.scoreboard.limit;
const collectionKey = 'users';


module.exports = {

    /**
     * Returns an array of all ranked solo players if any, sorted in order of rank. 
     */
    getSoloRankedUsersSorted() {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find().limit(rankedLimit).sort({soloWins: -1}).toArray(function (err, res) {
                        if (err)
                            reject(err);
                        else  {
                            /*
                            res.sort(function (u1, u2) {
                                if (u1.soloWins == u2.soloWins) 
                                   return u1.soloLosses - u2.soloLosses;
                                return u2.soloWins - u1.soloWins;
                            });
                            */
                            resolve(res);
                        }
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    },

     /**
     * Returns an array of all ranked team players if any, sorted in order of rank. 
     */
    getTeamRankedUsersSorted() {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find().limit(rankedLimit).sort({teamWins: -1}).toArray(function (err, res) {
                        if (err)
                            reject(err);
                        else  {
                            /*
                            res.sort(function (u1, u2) {
                                if (u1.teamWins == u2.teamWins) 
                                   return u1.teamLosses - u2.teamLosses;
                                return u2.teamWins - u1.teamWins;
                            });
                            */
                            resolve(res);
                        }
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    },

    
    /**
     * Returns an array of all ranked ffa players if any, sorted in order of rank.  
     */
    getFFARankedUsersSorted() {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find().limit(rankedLimit).sort({ffaWins: -1}).toArray(function (err, res) {
                        if (err)
                            reject(err);
                        else  {
                            /*
                            res.sort(function (u1, u2) {
                                if (u1.ffaWins == u2.ffaWins) 
                                   return u1.ffaLosses - u2.ffaLosses;
                                return u2.ffaWins - u1.ffaWins;
                            });
                            */
                            resolve(res);
                        }
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    },

    
    /**
     * Returns the ffa game ranking of a user with matching name. A 0 idicates that the user has no ranking. 
     * @param {*} name target user
     */
    getUserFFARank(name) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find().limit(rankedLimit).sort({ffaWins: -1}).toArray(function (err, res) {
                        if (err)
                            reject(err);
                        else  {
                            res.sort(function (u1, u2) {
                                if (u1.ffaWins == u2.ffaWins) 
                                   return u1.ffaLosses - u2.ffaLosses;
                                return u2.ffaWins - u1.ffaWins;
                            });
                            for (var i = 0; i < res.length; i++) {
                                if (res[i].ffaWins == 0)   // no rank without a win
                                    resolve(0);
                                if (name == res[i].dbName) 
                                    resolve(i + 1);
                            }
                            resolve(0);
                        }
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    },
    
    
    /**
     * Returns the solo game ranking of a user with matching name. A 0 idicates that the user has no ranking. 
     * @param {*} name target user
     */
    getUserSoloRank(name) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find().limit(rankedLimit).sort({soloWins: -1}).toArray(function (err, res) {
                        if (err)
                            reject(err);
                        else  {
                            res.sort(function (u1, u2) {
                                if (u1.soloWins == u2.soloWins) 
                                   return u1.soloLosses - u2.soloLosses;
                                return u2.soloWins - u1.soloWins;
                            });
                            for (var i = 0; i < res.length; i++) {
                                if (res[i].soloWins == 0)   // no rank without a win
                                    resolve(0);
                                if (name == res[i].dbName) 
                                    resolve(i + 1);
                            }
                            resolve(0);
                        }
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    },

    /**
     * Returns the team game ranking of a user with matching name. A 0 idicates that the user has no ranking. 
     * @param {*} name target user
     */
    getUserTeamRank(name) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find().limit(rankedLimit).sort({teamWins: -1}).toArray(function (err, res) {
                        if (err)
                            reject(err);
                        else  {
                            res.sort(function (u1, u2) {
                                if (u1.teamWins == u2.teamWins) 
                                   return u1.teamLosses - u2.teamLosses;
                                return u2.teamWins - u1.teamWins;
                            });
                            for (var i = 0; i < res.length; i++) {
                                if (res[i].teamWins == 0)   // no rank without a win
                                    resolve(0);
                                if (name == res[i].dbName) 
                                    resolve(i + 1);
                            }
                            resolve(0);
                        }
                    });
                }
                if (db !== null) 
                    db.close();
            });
        });
    },

    /**
     * Finds one user with matching user name. 
     * @param {*} name user name
     */
    getUserByName(name) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).findOne({dbName: name.toLowerCase()}, function (err, res) {
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
     * Queries the database for a user with a matching substring "pin" would return Pinzu and so on. 
     * @param {*} search search term
     */
    getMatchingUsers(search) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    db.db(dbName).collection(collectionKey).find({ dbName: {$regex: "^" + search.toLowerCase(), $options: "$i"}}).toArray(function (err, res) {
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
     * Returns all users stored in the database
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
     * Increases the stats to all players found in the replay. The multipler is used to specify if it the user stats 
     * should be increased (1) or decreased (-1).
     * @param {*} replay replay object
     * @param {*} mult incresement multipler 
     */
    increaseStats(replay, mult) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if (err) 
                    reject(err);
                else {
                    for (var i = 0; i < replay.players.length; i++) {
                        const u = new BnetUser();
                        u.name = replay.players[i].name;
                        u.dbName = u.name.toLowerCase();
                        if (replay.gameType === "team") {
                            u.teamWins = (replay.players[i].result === "win")? 1 : 0;
                            u.teamLosses = (replay.players[i].result === "lose")? 1 : 0;
                            u.teamKills = replay.players[i].kills;
                            u.teamDeaths = replay.players[i].deaths;
                        }
                        else if (replay.gameType === "solo") {
                            u.soloWins = (replay.players[i].result === "win")? 1 : 0;
                            u.soloLosses = (replay.players[i].result === "lose")? 1 : 0;
                            u.soloKills = replay.players[i].kills;
                            u.soloDeaths = replay.players[i].deaths; 
                        }
                        else if (replay.gameType === "ffa") {
                            u.ffaWins = (replay.players[i].result === "win")? 1 : 0;
                            u.ffaLosses = (replay.players[i].result === "lose")? 1 : 0;
                            u.ffaKills = replay.players[i].kills;
                            u.ffaDeaths = replay.players[i].deaths;   
                        }
                        (async () => {
                            await db.db(dbName).collection(collectionKey).updateOne({dbName: u.dbName}, 
                                {
                                    $set: { name: u.name, dbName: u.dbName },
                                    $inc: 
                                    { 
                                        soloWins: parseInt(u.soloWins*mult), soloLosses: parseInt(u.soloLosses*mult), soloKills: parseInt(u.soloKills*mult), soloDeaths: parseInt(u.soloDeaths*mult),
                                        teamWins: parseInt(u.teamWins*mult), teamLosses: parseInt(u.teamLosses*mult), teamKills: parseInt(u.teamKills*mult), teamDeaths: parseInt(u.teamDeaths*mult),
                                        ffaWins: parseInt(u.ffaWins*mult), ffaLosses: parseInt(u.ffaLosses*mult), ffaKills: parseInt(u.ffaKills*mult), ffaDeaths: parseInt(u.ffaDeaths*mult) 
                                    } 
                                },
                                {upsert: true},
                            ); 
                        })();
                    }
                    if (db !== null) 
                        db.close();
                    resolve();
                }
            });
        });
    }
};