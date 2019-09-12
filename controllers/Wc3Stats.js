const fetch = require('node-fetch');
const request = require('request-promise');

/**
 * This is a controller class for resources found at wc3stats.com
 */
module.exports = class Wc3Stats {

    /**
     * Uploads a discord attached file to wc3stats.com/upload and returns the JSON response.
     * 
     * @param {Attachment} attachment 
     */
    static postReplayAttachment(attachment) {
        return new Promise(function (resolve, reject) {
            let formData = {
                 file: request (attachment.url) 
            };
            request.post('https://api.wc3stats.com/upload', {formData, json: true})
            .then(function (json) {
                resolve(json);
            })
            .catch(function (err) {
                console.log(err);
                reject(err);
            }); 
        });
    }

    /**
     * Fetches replay from wc3stats.com/games/id returning a single replay object. 
     * 
     * @param {integer} id 
     */
    static fetchReplayById(id) {
        return new Promise(function (resolve, reject) {
            fetch(`https://api.wc3stats.com/replays/` + id + `&toDisplay=true`)
            .then(res => res.json())
            .then(json => {
                var body = json.body;
                if (!body) {
                    reject(new Error("no body found"));
                } else {
                    resolve(body);
                }
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }

    /**
     * Fetches all the latest replays from wc3stats.com/games returning the json body containing an array of replays.
     */
    static fetchLatestReplays() {
        return new Promise(function (resolve, reject) {
            fetch(`https://api.wc3stats.com/games?sort=id&order=desc`)
            .then(res => res.json())
            .then(json => {
                var body = json.body;
                if (!body) {
                    reject(new Error("no body found"));
                } else {
                    resolve(body);
                }
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
}