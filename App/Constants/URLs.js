import * as devURLs from './devURLs';
import * as prodURLs from './prodURLs';

const stages = {
    development : devURLs,
    production : prodURLs
}

// @todo uncomment this while going production
// const urls = process.env.NODE_ENV ? stages[ process.env.NODE_ENV ] : stages.development;
const urls = stages.development;

export const URLs = {
    ...urls
}