import { sign } from 'jsonwebtoken';
import md5 from 'md5';
import config from "../../conf";
import { CompanyModel } from '../../models';
import {
    generateResponse, parseBody, stripeAmountPadding
} from '../../utilities/index';
import { chargeCustomer, createCustomer, createToken, deleteCustomer, updateCustomer } from '../../utilities/stripe';

export async function registerCompany ( req, res ) {
    const {
        company_name,
        email,
        password
    } = parseBody( req );

    const company = await CompanyModel.find( { where: { company_name, email } } );

    if ( company )
    {
        generateResponse( 400, `Company with name ${ company_name } and email ${ email } already exists.`, {}, res );
    } else
    {
        const passwordHash = md5( password );
        const response = await CompanyModel.create( {
            company_name,
            email,
            password: passwordHash
        } );

        let tokenObj = {
            id: response.id,
            company_name: response.company_name,
            email: response.email
        }

        let token = sign( {
            user: tokenObj,
        }, `${ config.app[ 'jwtsecret' ] }`, {
            expiresIn: "1y"
        } );

        const stripeCustomer = await createCustomer( response.email );

        await CompanyModel.update( { token, stripeId: stripeCustomer.id }, {
            where: {
                id: response.id
            }
        } );
        generateResponse( 201, 'Company registered!', {
            id: response.id,
            token
        }, res );
    }

}

export async function updateCompany ( req, res ) {
    const { company_name, id } = parseBody( req );

    const company = await CompanyModel.find( { where: { id } } );

    if ( company )
    {
        const isCompanyAlreadyExists = await CompanyModel.find( { where: { company_name, email: company.email } } )

        if ( ( isCompanyAlreadyExists && isCompanyAlreadyExists.id === id ) || !isCompanyAlreadyExists )
        {
            await CompanyModel.update( { company_name }, { where: { id } } );
            generateResponse( 200, 'Company name updated!', {}, res );
        } else
        {
            generateResponse( 400, `Company with name ${ company_name } and email ${ company.email } already exists.`, {}, res );
        }
    } else
    {
        generateResponse( 404, `Company with id ${ id } not found.`, {}, res );
    }
}

export async function updateCompanyPassword ( req, res ) {
    const { password, id } = parseBody( req );

    const company = await CompanyModel.find( { where: { id } } );

    if ( company )
    {
        const isPasswordSame = compareMd5Password( company.password, password );
        if ( !isPasswordSame )
        {
            await CompanyModel.update( { password: md5( password ) }, { where: { id } } );
            generateResponse( 200, 'Password updated!', {}, res );
        } else
        {
            generateResponse( 400, `Old password and new password can not be same.`, {}, res );
        }
    } else
    {
        generateResponse( 404, `Company with id ${ id } not found.`, {}, res );
    }
}

export async function getAllCompanies ( req, res ) {
    const companies = await CompanyModel.findAll( { attributes: { exclude: [ 'password', 'token' ] } } );

    generateResponse( 200, 'Companies fetched', companies, res );
}

export async function getCompany ( req, res ) {
    const { id } = req.params;

    const company = await CompanyModel.find( { where: { id }, attributes: { exclude: [ 'password' ] } } );

    if ( company )
    {
        generateResponse( 200, 'Company details fetched', company, res );

    } else
    {
        generateResponse( 404, `Company with id ${ id } not found.`, {}, res );
    }

}

export async function deleteCompany ( req, res ) {
    const { id } = parseBody( req );

    const company = await CompanyModel.find( { where: { id } } );

    if ( company )
    {
        await deleteCustomer( company.stripeId );
        await CompanyModel.destroy( { where: { id } } );

        generateResponse( 200, 'Company removed!', {}, res );
    } else
    {
        generateResponse( 404, `Company with id ${ id } not found.`, {}, res );
    }
}

export async function loginCompany ( req, res ) {
    let { email, password } = parseBody( req );

    const isCompanyExists = await CompanyModel.findOne( { where: { email } } );

    if ( isCompanyExists )
    {
        const isValid = compareMd5Password( isCompanyExists.password, password );
        if ( isValid )
        {
            let tokenObj = {
                id: isCompanyExists.id,
                company_name: isCompanyExists.company_name,
                email: isCompanyExists.email
            }

            let token = sign( {
                user: tokenObj,
            }, `${config.app['jwtsecret']}`, {
                expiresIn: "1y"
            } );

            await CompanyModel.update( { token }, {
                where: {
                    id: isCompanyExists.id
                }
            } );

            generateResponse( 200, 'Successfully Loggedin', {
                id: isCompanyExists.id,
                token
            }, res );
        } else
        {
            generateResponse( 400, 'Invalid Credentials', {}, res );
        }
    } else
    {
        generateResponse( 400, 'Invalid Credentials', {}, res );
    }
}

export async function loadBalance ( req, res ) {
    const { id: company_id } = req.user;
    const { balance } = parseBody( req );

    try
    {
        const company = await CompanyModel.find( { where: { id: company_id } } );

        if ( company )
        {
            const token = await createToken();
            await updateCustomer( company.stripeId, { source: token.id } );
            await chargeCustomer( {
                amount: stripeAmountPadding( balance ),
                currency: 'usd',
                customer: company.stripeId
            } );
            const updatedBalance = parseInt( company.balance ) + parseInt( balance )

            await CompanyModel.update( { balance: updatedBalance }, { where: { id: company_id } } );
            generateResponse( 200, 'Balance loaded', {}, res );
        } else
        {
            generateResponse( 404, `Company with id ${ company_id } not found.`, {}, res );
        }
    } catch ( ex )
    {
        generateResponse( 400, ex.message, {}, res );
    }

}

function compareMd5Password ( hashedPassword, passwordToCheck ) {
    console.log( hashedPassword );
    console.log( passwordToCheck );
    return hashedPassword === md5( passwordToCheck );
}