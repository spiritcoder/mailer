import {CustomError} from './custom-error'

export class NotAuthorizedError extends CustomError{

    reason = "You are not Authorized"
    statusCode = 401;

    constructor(){
        super('Not Authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    serializeErrors(){
        return [
            {message : this.reason}
        ]
    }
}