import type { NextFunction, Request, Response } from 'express'; import { AppError } from '../utils/http.js';
export function requestId(req:Request,res:Response,next:NextFunction){const id=typeof req.headers['x-request-id']==='string'?req.headers['x-request-id']:crypto.randomUUID(); res.setHeader('x-request-id',id); next();}
export function notFound(_req:Request,_res:Response,next:NextFunction){next(new AppError(404,'Route not found'));}
export function errors(err:Error & {status?:number},req:Request,res:Response,_next:NextFunction){const status=err.status||500; req.log?.error({err,status},'request failed'); res.status(status).json({error:{message:status===500?'Internal server error':err.message,requestId:res.getHeader('x-request-id')}});}
