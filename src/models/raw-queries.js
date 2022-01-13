import {
    sequelize
} from "../database/config";
import {
    ROLES,
    STATUS
}
from '../utilities/constants.js'

function query(query, type, replacements = []) {
    return sequelize.query(query, {
        type,
        replacements
    });
}

exports.fetchUsersByRoleId = function (roleId) {
    return new Promise((resolve, reject) => {
        let rawQuery = `SELECT U.id, U.firstname, U.lastname, U.gender, U.email, U.mobile, U.home, U.status, U.latitude, U.longitude, U.address, U.profileimage, U.cnicbackurl, U.cnicfronturl, U.billurl, U.createdby, U.modifiedby, U.createdAt, U.updatedAt FROM ls_user_roles AS UR 
                INNER JOIN ls_users AS U
                ON U.id = UR.userId
                WHERE UR.roleId = ?`;
        query(rawQuery, sequelize.QueryTypes.SELECT, [roleId]).then(resp => {
            if (resp) {
                resolve(resp);
            } else {
                resolve(null);
            }
        });
    });
}

// Todo
exports.fetchContractors = function (categoryId) {
    return new Promise((resolve, reject) => {
        let rawQuery = '';
        if (categoryId) {
            rawQuery = `SELECT U.id, U.firstname, U.lastname, U.gender, U.email, U.mobile, U.home, U.status, U.latitude, U.longitude, U.address, U.profileimage, U.cnicbackurl, U.cnicfronturl, U.billurl, U.createdby, U.modifiedby, U.createdAt, U.updatedAt FROM ls_user_roles AS UR 
                INNER JOIN ls_users AS U
                ON U.id = UR.userId
                INNER JOIN ls_user_skills AS lus ON lus.userId=U.id 
                INNER JOIN ls_user_payments AS UP ON UP.paidBy=U.id
                WHERE UR.roleId = ? AND UP.status=? AND U.status=? AND U.numberverify=? AND U.isonline=? AND lus.skillId=?`;
            query(rawQuery, sequelize.QueryTypes.SELECT, [
                ROLES.CONTRACTOR,
                STATUS.ACTIVE,
                STATUS.APPROVED,
                STATUS.APPROVED,
                STATUS.TRUE,
                categoryId
            ]).then(resp => {
                if (resp) {
                    resolve(resp);
                } else {
                    resolve(null);
                }
            });
        } else {
            rawQuery = `SELECT U.id, U.firstname, U.lastname, U.gender, U.email, U.mobile, U.home, U.status, U.latitude, U.longitude, U.address, U.profileimage, U.cnicbackurl, U.cnicfronturl, U.billurl, U.createdby, U.modifiedby, U.createdAt, U.updatedAt FROM ls_user_roles AS UR 
                INNER JOIN ls_users AS U
                ON U.id = UR.userId
                INNER JOIN (select * from ls_user_payments where ls_user_payments.status='active') AS UP
                ON UP.paidBy = U.id
                WHERE UR.roleId = ? AND UP.status=? AND U.status=? AND U.numberverify=? AND U.isonline=?`;
            query(rawQuery, sequelize.QueryTypes.SELECT, [
                ROLES.CONTRACTOR,
                STATUS.ACTIVE,
                STATUS.APPROVED,
                STATUS.APPROVED,
                STATUS.TRUE
            ]).then(resp => {
                if (resp) {
                    resolve(resp);
                } else {
                    resolve(null);
                }
            });
        }
    });
}

exports.fetchSkillsByUserId = function (userId, skills) {
    return new Promise((resolve, reject) => {
        let rawQuery;
        if (skills) {
            rawQuery = `SELECT S.* FROM ls_user_skills AS US
                        INNER JOIN ls_skills AS S ON S.id=US.skillId
                        WHERE US.userId=? AND US.skillId IN (?)`;
            query(rawQuery, sequelize.QueryTypes.SELECT, [userId, skills]).then(resp => {
                if (resp) {
                    resolve(resp);
                } else {
                    resolve(null);
                }
            });
        } else {
            rawQuery = `SELECT S.* FROM ls_user_skills AS US
                        INNER JOIN ls_skills AS S ON S.id=US.skillId
                        WHERE US.userId=?`;
            query(rawQuery, sequelize.QueryTypes.SELECT, [userId]).then(resp => {
                if (resp) {
                    resolve(resp);
                } else {
                    resolve(null);
                }
            });
        }
    });
}

exports.fetchSkillByUserIdAndSkillId = function (userId, childId) {
    return new Promise((resolve, reject) => {
        let rawQuery = `SELECT S.* FROM ls_user_skills AS US
                        INNER JOIN ls_skills AS S ON S.id=US.skillId
                        WHERE US.userId=? AND US.skillId=?`;
        query(rawQuery, sequelize.QueryTypes.SELECT, [userId, childId]).then(resp => {
            if (resp) {
                resolve(resp);
            } else {
                resolve(null);
            }
        });
    });
}


exports.fetchUsersAndTheirRoles = function () {
    return new Promise((resolve, reject) => {
        let rawQuery = `SELECT U.id, U.firstname, U.numberverify, U.lastname, U.gender, U.email, U.mobile, U.home, U.status, U.latitude, U.longitude, U.address, U.profileimage, U.cnicbackurl, U.cnicfronturl, U.billurl, U.createdby, U.modifiedby, U.createdAt, U.updatedAt, R.title as role FROM ls_user_roles AS UR 
                INNER JOIN ls_users AS U
                ON U.id = UR.userId
                INNER JOIN ls_roles AS R
                ON R.id = UR.roleId`;
        query(rawQuery, sequelize.QueryTypes.SELECT, []).then(resp => {
            if (resp) {
                resolve(resp);
            } else {
                resolve(null);
            }
        });
    });
}