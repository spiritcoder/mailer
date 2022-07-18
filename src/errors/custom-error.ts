 
export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message)
        //needed when you are extending a built in class in javascript
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    abstract serializeErrors(): { message: string; field?: string }[]
}