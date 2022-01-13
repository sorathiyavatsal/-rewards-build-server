'use strict';

import {
    Router
} from "express";
import {
    log, loggedIn
} from "../api/middlewares/index";
import { deleteCompany, getAllCompanies, getCompany, loadBalance, loginCompany, registerCompany, updateCompany, updateCompanyPassword } from "./handlers/company";

export default class CompanyAPI {
    constructor () {
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes () {
        let router = this.router;
        router.post( '/', log, registerCompany );
        router.post( '/login', log, loginCompany );
        router.post( '/change-password', log, updateCompanyPassword );
        router.post( '/charge', log, loggedIn, loadBalance );
        router.put( '/', log, updateCompany );
        router.get( '/', log, getAllCompanies );
        router.get( '/:id', log, getCompany );
        router.delete( '/', log, deleteCompany );
    }

    getRouter () {
        return this.router;
    }

    getRouteGroup () {
        return '/company';
    }
}