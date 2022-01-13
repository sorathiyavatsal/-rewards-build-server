const nodemailer = require( 'nodemailer' );
import config from '../conf/index';
import moment from 'moment';

export function sendEmail ( message ) {
    nodemailer.createTestAccount( ( err, account ) => {

        var transporter = nodemailer.createTransport( {
            host: config.email[ 'host' ],
            secureConnection: true,
            port: 465,
            auth: {
                user: config.email[ 'user' ],
                pass: config.email[ 'password' ]
            }
        } );

        var mailOptions = {
            from: config.email[ 'user' ],
            to: message.to,
            subject: message.subject,
            html: message.body
        };
        // send mail with defined transport object
        transporter.sendMail( mailOptions, ( error, info ) => {
            if ( error )
            {
                return console.log( error );
            }
            console.log( 'Message sent: %s', info.messageId );
            // Preview only available when sending through an Ethereal account
            // console.log( info );

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        } );
    } );
}

export function getRedeemRewardTemplate ( company, reward, rewardLocations, rewardExpiry ) {
    return `<html>
    <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
    
        <!-- START HEADER/BANNER -->
    
        <tbody>
            <tr>
                <td align="center">
                    <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td height="35"></td>
                            </tr>
    
                            <tr>
                                <td align="center"
                                    style="font-family: 'Lato', sans-serif; font-size:14px; color:#2a3a4b; line-height:24px; font-weight: 300;">
                                    You have been sent the following reward from ${ company.company_name }.
                                </td>
                            </tr>
                            <tr>
                                <td height="10"></td>
                            </tr>
    
                        </tbody>
                    </table>
                </td>
            </tr>
    
            <tr>
                <td align="center">
                    <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0"
                        style="border-top: 1px solid #dbd9d9; border-bottom: 1px solid #dbd9d9; border-left: 1px solid #dbd9d9; border-right: 1px solid #dbd9d9; ">
                        <tbody>
                            <tr>
                                <td height="10"></td>
                            </tr>
                            <tr>
                                <td>
                                    <table class="col3" width="183" border="0" align="center" cellpadding="0"
                                        cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td height="30"></td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <table class="insider" width="133" border="0" align="center"
                                                        cellpadding="0" cellspacing="0">
    
                                                        <tbody>
                                                            <tr align="center" style="line-height:0px;">
                                                                <td>
                                                                    <img style="display:block; line-height:0px; font-size:0px; border:0px;"
                                                                    src="${ config.app.host }:${ config.app.port }/reward/${ reward.product_image }"
                                                                        width="69" height="78" alt="icon">
                                                                </td>
                                                            </tr>
    
    
                                                            <tr>
                                                                <td height="15"></td>
                                                            </tr>
    
    
                                                            <tr align="center">
                                                                <td
                                                                    style="font-family: 'Raleway', sans-serif; font-size:20px; color:#2b3c4d; line-height:24px; font-weight: bold;">
                                                                    ${ reward.reward_name }</td>
                                                            </tr>
    
    
                                                            <tr>
                                                                <td height="10"></td>
                                                            </tr>
    
    
                                                            <tr align="center">
                                                                <td
                                                                    style="font-family: 'Lato', sans-serif; font-size:14px; color:#757575; line-height:24px; font-weight: 300;">
                                                                    ${ reward.reward_description }</td>
                                                            </tr>
    
                                                            <tr align="center">
                                                                <td
                                                                    style="font-family: 'Lato', sans-serif; font-size:14px; color:#757575; line-height:24px; font-weight: 300;">
                                                                    Expiry: ${ moment( rewardExpiry ).format( 'MMMM Do YYYY, h:mm:ss a' ) }</td>
                                                            </tr>
    
                                                            <tr>
                                                                <td height="20"></td>
                                                            </tr>
    
                                                            <tr align="center" style="line-height:0px;">
                                                                <td>
                                                                    <a href="${ config.app.host }:${ config.app.port }/redeem">Redeem</a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="30"></td>
                                            </tr>
                                        </tbody>
                                    </table>
    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
    
            <tr>
                <td align="center">
                    <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td height="35"></td>
                            </tr>
    
                            <tr>
                                <td align="center"
                                    style="font-family: 'Lato', sans-serif; font-size:14px; color:#2a3a4b; line-height:24px; font-weight: 300;">
                                    Terms and Conditions
                                </td>
                            </tr>

                            <tr>
                                <td height="10"></td>
                            </tr>
    
                            <tr>
                                <td align="center"
                                    style="font-family: 'Lato', sans-serif; font-size:12px; color:#2a3a4b; line-height:24px; font-weight: 300;">
                                    ${ reward.reward_terms }
                                </td>
                            </tr>

                            ${ rewardLocations.length > 0 ? `<tr>
                            <td height="10"></td>
                        </tr>

                        <tr>
                            <td align="center"
                                style="font-family: 'Lato', sans-serif; font-size:14px; color:#2a3a4b; line-height:24px; font-weight: 300;">
                                This voucher is for ${ reward.reward_name } redeemable at the following location(s): <br>
                                ${ rewardLocations.join( '<br>' ) }
                            </td>
                        </tr>`: `` }
    
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    
    </html>`;
}