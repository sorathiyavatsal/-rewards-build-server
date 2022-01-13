const request = require( 'request' )

export const STATUS_CODE = {
    NOT_FOUND: 404,
    OK: 200,
    BAD_GATEWAY: 502
}

export function parseBody ( req ) {
    let obj;
    if ( typeof req.body === 'object' )
    {
        obj = req.body;
    } else
    {
        obj = JSON.parse( req.body );
    }

    return obj;
}

export function isAllStatusResolved ( itemArray, element ) {
    let flag = false;
    for ( var i = 0; i < itemArray.length; i++ )
    {
        if ( itemArray[ i ][ element ] == false )
        {
            flag = false;
            break;
        } else
        {
            flag = true;
        }
    }
    return flag;
}

export function generateResponse ( status, message, data, res ) {
    res.status( status ).json( {
        message,
        data
    } );
}

export function getModifiedObjectToUpdateUser ( userObject ) {
    delete userObject.id;
    delete userObject.password;
    delete userObject.username;
    // delete userObject.email;
    delete userObject.isactive;
    return userObject;
}

export function getCurrentTimestamp () {
    let date = new Date();
    return date.getTime();
}

export function pad ( data, limit ) {
    // data = 11
    // limit = 4
    console.log( data );
    console.log( limit );
    var padding = '';
    for ( var index = 0; index < limit - data.length; index++ )
    {
        padding += '0';
    }
    data = padding + ( parseInt( data ) + 1 );
    return data
}

export function calculateDistance ( lat1, lon1, lat2, lon2, unit ) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin( radlat1 ) * Math.sin( radlat2 ) + Math.cos( radlat1 ) * Math.cos( radlat2 ) * Math.cos( radtheta );
    if ( dist > 1 )
    {
        dist = 1;
    }
    dist = Math.acos( dist )
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if ( unit == "K" )
    {
        dist = dist * 1.609344
    }
    if ( unit == "N" )
    {
        dist = dist * 0.8684
    }
    return dist
}

export function generateRandomString ( length ) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for ( var i = 0; i < length; i++ )
        text += possible.charAt( Math.floor( Math.random() * possible.length ) );

    return text;
}

export function generateRandomNumber ( length ) {
    var text = "";
    var possible = "0123456789";

    for ( var i = 0; i < length; i++ )
        text += possible.charAt( Math.floor( Math.random() * possible.length ) );

    return text;
}

export function sendVerificationCode ( number, text ) {
    console.log( "SMS DATA" )
    console.log( number )
    console.log( text )
    let mNumber = number.replace( "-", "" )
    request.post( "https://lifetimesms.com/plain", {
        formData: {
            "api_token": "724d1a58a9d4d791efa307ef5953063a7c4a082263",
            "api_secret": "Kingston@123#",
            "to": mNumber,
            "from": "8584",
            "message": text
        }
    }, ( error, res, body ) => {
        if ( error )
        {
            console.error( error )
            return
        }
        console.log( `statusCode: ${ res.statusCode }` )
        console.log( body )
    } )
}

// sendVerificationCode('03322508190', "this is here the code" + "okokok tested")

export function sendSms ( number, text ) {
    const accountSid = 'AC839762c3e40bbebdbe5d6abfdc138deb';
    const authToken = '959d68d7b7fc5739e4cb8cf367802a95';
    const client = require( 'twilio' )( accountSid, authToken );
    console.log( "Sending..." );
    client.messages
        .create( {
            body: text,
            from: '+15055391184',
            to: '+923322508190'
        } )
        .then( message => {
            console.log( message.sid );
            console.log( "Message Sent" );
        } )
        .done();
}

export function stripeAmountPadding ( amount ) {

    amount = amount.toString();
    if ( amount.includes( "." ) )
    {
        amount = amount.replace( /\D/g, '' );
        amount = parseInt( amount );
        return amount;
    }
    else
    {
        amount = amount + "00";
        amount = parseInt( amount );
        return amount;
    }

}