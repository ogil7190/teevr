/* eslint-disable */

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const compression = require( 'compression' );
const colors = require( 'colors' );
const path = require( 'path' );
var url = require('url');
const morgan = require( 'morgan' );

var gplay = require('google-play-scraper');
gplay.app({appId: 'com.fatafat' }).then( console.log );

// server configuration
const PROTOCOL = 'http://';
const HOST = 'localhost';
const PORT = '65534';
const SERVER_URL = PROTOCOL + HOST + ':' + PORT;
const JSON_DIR = path.resolve( __dirname + '/server/jsons' );
const IMAGES_DIR = path.resolve( __dirname + '/server/images' );

const app = express();

const delay = ( delay = 500 ) => {
    return ( request, response, next ) => {
        const url_parts = url.parse(request.url, true);
        const query = url_parts.query;
        setTimeout( next, query.delay || delay );
    };
};

app.use( morgan( 'tiny' ) );

app.use(
    bodyParser.json( { limit: '50mb' } ),
    bodyParser.text( { limit: '50mb' } )
);

app.set( 'json spaces', 4 );
app.use( compression() );

app.use( ( req, res, next ) => {
    res.set( {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': req.get( 'Access-Control-Request-Headers' ),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    } );

    next();
} );

app.use( ( req, res, next ) => {
    if( 'OPTIONS' === req.method ) {
        return res.end();
    }

    return next();
} );

app.get( '/', ( req, res ) => {
    res.send( `Server is Ready at ${PORT}` );
} );

app.use( '/jsons', delay( 1000 ), express.static( JSON_DIR ) );

app.use( '/images', express.static( IMAGES_DIR ) );


app.listen( PORT, () => {
    console.log(
        colors.green(
            `App running on port ${ colors.black.bgYellow.bold( ' ' + PORT + ' ' ) } at ${ colors.white.bgBlue.italic( ' ' + SERVER_URL + ' ' ) }`
        )
    );

    console.log( colors.grey( '**********************************************************' ) );
    console.log(
        colors.grey(
            `JSON directory is ${ colors.white.italic( JSON_DIR ) }`
        )
    );
} );
