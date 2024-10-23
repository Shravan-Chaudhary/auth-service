import { Request, Response } from "express";
import { EApplicationEnvoirnment } from "../constants/application";
import { THttpResponse } from "./httpTypes";
import logger from "../../config/logger";
import { Config } from "../../config";

const httpResponse = (
    req: Request,
    res: Response,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown,
): void => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req.ip ?? null,
            method: req.method,
            url: req.originalUrl,
        },
        message: responseMessage,
        data: data,
    };

    logger.info("CONTROLLER_RESPONSE", {
        meta: response,
    });

    // Remove IP if in production
    if (Config.ENV === EApplicationEnvoirnment.PRODUCTION) {
        delete response.request.ip;
    }

    res.status(responseStatusCode).json(response);
};

export default httpResponse;
