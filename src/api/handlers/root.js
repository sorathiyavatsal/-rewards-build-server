import {
    generateResponse
} from '../../utilities/index';

export function DefaultHandler(req, res) {
    generateResponse(true, 'Default Handler', null, res);
}