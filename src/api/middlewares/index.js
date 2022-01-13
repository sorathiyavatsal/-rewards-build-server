'use strict';

import {
    Request,
    Response,
    NextFunction
} from 'express';
import jwt from "jsonwebtoken";
import config from "../../conf";


export function log(req, res, next) {
    console.log(req.originalUrl);
    next();
}

export function loggedIn(req, res, next) {
    decodeToken(req).then(data => {
        req.user = data.user;
        next();
    }).catch(ex => {
        // let error = {type: ERROR_TYPE.FORCE_UPDATE, message: 'Update your application.'};
        // let error = {type: ERROR_TYPE.DEACTIVATE_USER, message: 'User is deactivated.'};
        // let error = {type: ERROR_TYPE.CUSTOM, message: 'Oops something went wrong..'};
        res.status(200).json({
            success: false,
            error: ["Unauthenticated request"]
        });
        console.error(ex);
    });
}

export function decodeToken(req) {
    return new Promise((resolve, reject) => {
        let token = req.headers.token;
        jwt.verify(token, `${config.app['jwtsecret']}`, (err, decoded) => {
            if (err === null) {
                resolve(decoded);
            } else {
                reject(err);
            }
        });
    });
}