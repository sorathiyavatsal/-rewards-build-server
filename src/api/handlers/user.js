import { compare, compareSync, genSalt, hash } from 'bcrypt';
import { CompanyModel, RetailerModel, UserModel } from '../../models';
import config from "../../conf";
import {
    generateResponse, parseBody
} from '../../utilities/index';
import { sign } from 'jsonwebtoken';

export async function registerUser ( req, res ) {
    const {
        first_name,
        last_name,
        password,
        email,
        company_id,
        retailer_id
    } = parseBody( req );

    try
    {
        const user = await UserModel.find( { where: { email } } );

        if ( user )
        {
            generateResponse( 400, `User with email ${ email } already exists.`, {}, res );
        } else
        {
            const salt = await genSalt( parseInt( config.app[ 'password_saltRounds' ], 10 ) );
            const passwordHash = await hash( password, salt );

            const isCompanyExists = await CompanyModel.find( { where: { id: company_id } } );
            const isRetailerExists = await RetailerModel.find( { where: { id: retailer_id } } );

            const errorMessages = [];
            if ( company_id && !isCompanyExists )
            {

                if ( !isCompanyExists )
                {
                    errorMessages.push( `Company with id ${ company_id } not exists.` );
                }
            }

            if ( retailer_id && !isRetailerExists )
            {

                if ( !isRetailerExists )
                {
                    errorMessages.push( `Retailer with id ${ retailer_id } not exists.` );
                }

            }

            if ( errorMessages.length > 0 )
            {
                throw new Error( errorMessages.join( ' ' ) );
            }

            const response = await UserModel.create( {
                first_name,
                last_name,
                password: passwordHash,
                email,
                company_id,
                retailer_id
            } );

            let tokenObj = {
                id: response.id,
                name: response.first_name + ' ' + response.last_name,
                email: response.email,
                company_id: response.company_id,
                retailer_id: response.retailer_id
            }
            let token = sign( {
                user: tokenObj,
            }, `${ config.app[ 'jwtsecret' ] }`, {
                expiresIn: "1y"
            } );

            await UserModel.update( { token }, {
                where: {
                    id: response.id
                }
            } );

            generateResponse( 201, 'User registered!', {
                id: response.id,
                email: response.email
            }, res );
        }
    } catch ( ex )
    {
        generateResponse( 400, ex.message, {}, res )
    }
}
export async function updateUser ( req, res ) {
    const {
        first_name,
        last_name,
        company_id,
        retailer_id,
        id
    } = parseBody( req );

    try
    {
        const user = await UserModel.find( { where: { id } } );

        if ( user )
        {
            const isCompanyExists = await CompanyModel.find( { where: { id: company_id } } );
            const isRetailerExists = await RetailerModel.find( { where: { id: retailer_id } } );

            const errorMessages = [];
            if ( company_id && !isCompanyExists )
            {

                if ( !isCompanyExists )
                {
                    errorMessages.push( `Company with id ${ company_id } not exists.` );
                }
            }

            if ( retailer_id && !isRetailerExists )
            {

                if ( !isRetailerExists )
                {
                    errorMessages.push( `Retailer with id ${ retailer_id } not exists.` );
                }

            }

            if ( errorMessages.length > 0 )
            {
                throw new Error( errorMessages.join( ' ' ) );
            }

            await UserModel.update( {
                first_name,
                last_name,
                company_id,
                retailer_id
            }, { where: { id } } );
            generateResponse( 200, 'User updated!', {}, res );
        } else
        {
            generateResponse( 404, `User with id ${ id } not found.`, {}, res );
        }
    } catch ( ex )
    {
        generateResponse( 400, ex.message, {}, res )
    }
}

export async function getAllUsers ( req, res ) {
    let users = await UserModel.findAll( { attributes: [ 'first_name', 'last_name', 'email', 'company_id', 'retailer_id' ] } );

    for ( const user of users )
    {
        if ( user.company_id )
        {
            user.company = await CompanyModel.find( { where: { id: user.company_id } } );
        }

        if ( user.retailer_id )
        {
            user.retailer = await RetailerModel.find( { where: { id: user.retailer_id } } );
        }

        user.retailer_id = undefined;
        user.company_id = undefined;
    }

    generateResponse( 200, 'Users fetched', users, res );
}

export async function deleteUser ( req, res ) {
    const { id } = parseBody( req );

    const user = await UserModel.find( { where: { id } } );

    if ( user )
    {
        await UserModel.destroy( { where: { id } } );

        generateResponse( 200, 'User removed!', {}, res );
    } else
    {
        generateResponse( 404, `User with id ${ id } not found.`, {}, res );
    }
}

export async function loginUser ( req, res ) {
    let { email, password } = parseBody( req );

    const isUserExists = await UserModel.findOne( { where: { email } } );

    if ( isUserExists )
    {
        console.log( isUserExists.password, password )
        const isValid = compareSync( password, isUserExists.password );
        console.log( { isValid } );
        if ( isValid )
        {
            let tokenObj = {
                id: isUserExists.id,
                name: isUserExists.first_name + ' ' + isUserExists.last_name,
                email: isUserExists.email,
                company_id: isUserExists.company_id,
                retailer_id: isUserExists.retailer_id
            }
            let token = sign( {
                user: tokenObj,
            }, `${ config.app[ 'jwtsecret' ] }`, {
                expiresIn: "1y"
            } );

            await UserModel.update( { token }, {
                where: {
                    id: isUserExists.id
                }
            } );

            if ( isUserExists.company_id )
            {
                isUserExists.company = await CompanyModel.find( { where: { id: isUserExists.company_id } } );
            }

            if ( isUserExists.retailer_id )
            {
                isUserExists.retailer = await RetailerModel.find( { where: { id: isUserExists.retailer_id } } );
            }

            generateResponse( 200, 'Successfully Loggedin', {
                id: isUserExists.id,
                first_name: isUserExists.first_name,
                last_name: isUserExists.last_name,
                email: isUserExists.email,
                company: isUserExists.company,
                retailer: isUserExists.retailer
            }, res );
        } else
        {
            generateResponse( 400, 'Invalid Credentials', {}, res );
        }
    } else
    {
        generateResponse( 400, 'Invalid Credentialsnnn', {}, res );
    }
}