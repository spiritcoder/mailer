import {CustomError} from './custom-error'
 
export class DataNotSavedError extends CustomError{

    statusCode = 400;

    constructor(public message:string){
        super(message);
        Object.setPrototypeOf(this, DataNotSavedError.prototype)
    }

    serializeErrors(){
        return [
            {message : this.message}
        ]
    }
}