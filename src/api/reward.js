'use strict';

import {
    Router
} from "express";
import {
    log, loggedIn
} from "../api/middlewares/index";
import { addReward, deleteReward, fetchCompanyRewards, fetchSentRewards, getAllRewardDetails, getAllRewards, loadReward, redeemReward, sendReward, updateReward } from "./handlers/reward";
const multer = require( 'multer' )
const upload = multer( { dest: './uploads/rewards/' } )

export default class RewardAPI {
    constructor () {
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes () {
        let router = this.router;
        router.post( '/', log, upload.single('product_image'), addReward );
        router.post( '/load', log, loggedIn, loadReward );
        router.post( '/send', log, loggedIn, sendReward );
        router.post( '/redeem', log, loggedIn, redeemReward );
        router.put( '/', log, updateReward );
        router.get( '/', log, getAllRewards );
        router.get( '/company', log, loggedIn, fetchCompanyRewards );
        router.get( '/sent', log, loggedIn, fetchSentRewards );
        router.get( '/:id', log, getAllRewardDetails );
        router.delete( '/', log, deleteReward );
    }

    getRouter () {
        return this.router;
    }

    getRouteGroup () {
        return '/reward';
    }
}