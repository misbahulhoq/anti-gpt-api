import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import type { Response } from 'express';
type PostgresError = {
    code: string;
    message: string;
};
export declare class DatabaseExceptionFilter implements ExceptionFilter {
    catch(exception: PostgresError, host: ArgumentsHost): Response<any, Record<string, any>> | undefined;
}
export {};
