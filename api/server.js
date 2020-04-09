const express = require("express");
const status = require("http-status-codes");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/accounts", (req, res) => {
    db.select("*").from("accounts")
        .then(res2 => {
            res.status(status.OK).json(res2);
        }).catch(err => {res.status(status.INTERNAL_SERVER_ERROR).json({error: "Error retrieving accounts"})})
});

server.get("/accounts/:id", (req, res) => {
    db.select("*").from("accounts").where({id: req.params.id})
        .then(res2 => {
            if (res2.length > 0) {
                res.status(status.OK).json(res2[0]);
            } else {
                res.status(status.NOT_FOUND).json({error: "Can't find account with that ID"});
            }
            
        })
        .catch(err => {res.status(status.INTERNAL_SERVER_ERROR).json({error: "Error retrieving accounts"})})
});

server.post("/accounts", checkAccountBody, (req, res) => {
    db.insert(req.body).into("accounts")
        .then(res2 => {res.status(status.OK).json(res2[0]);})
        .catch(err => {res.status(status.intern)})
});

server.put("/accounts/:id", checkAccountBody, (req, res) => {
    db.from("accounts").where({id: req.params.id}).update(req.body)
        .then(res2 => {
            if (res2) {
                res.sendStatus(status.OK);
            } else {
                res.status(status.BAD_REQUEST).json({error: "No account with that ID"});
            }
        })
        .catch(err => {res.status(status.INTERNAL_SERVER_ERROR).json({error: "Internal server error?"})})
});

server.delete("/accounts/:id", (req, res) => {
    db.from("accounts").where({id: req.params.id}).del()
        .then(res2 => {
            if (res2) {
                res.sendStatus(status.OK);
            } else {
                res.status(status.BAD_REQUEST).json({error: "No account with that ID"});
            }
        })
        .catch(err => {res.status(status.INTERNAL_SERVER_ERROR).json({error: "Internal server error?"})})
})

function checkAccountBody(req, res, next) {
    if (typeof req.body === "object") {
        if (typeof req.body.name == "string"
            && typeof req.body.budget == "number") {
                next();
        } else {
            res.status(status.BAD_REQUEST).json({error: "The account must contain a 'name' string and 'budget' number"})
        }
    } else {
        res.status(status.BAD_REQUEST).json({error: "Requires a request body object"})
    }
}

module.exports = server;
