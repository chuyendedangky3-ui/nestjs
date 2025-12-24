import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'src/dtos/base.dto';

export const handleRequest = async (params: {
    action: () => Promise<any>;
    successMessage?: string;
    statusCode?: HttpStatus;
    errorMessage?: string;
    errorStatus?: HttpStatus;
}): Promise<Response> => {
    const {
        action,
        successMessage = 'OK',
        statusCode = HttpStatus.OK,
        errorMessage,
        errorStatus = HttpStatus.BAD_REQUEST,
    } = params;
    try {
        const data = await action();
        return new Response(statusCode, successMessage, data);
    } catch (err) {
        if (err instanceof HttpException) {
            throw err;
        }

        throw new HttpException(errorMessage || err.message, errorStatus);
    }
};
