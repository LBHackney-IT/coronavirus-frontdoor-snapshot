import Response from '../domain/Response';
import { logger } from 'lib/infrastructure/logging';

export default function createEndpoint({ allowedMethods, validators }, endpoint) {
  return async (req, res) => {
    function send(response) {
      Object.entries(response.headers).forEach(([key, value]) => res.setHeader(key, value));
      res.status(response.statusCode);
      return response.body ? res.send(response.body) : res.end();
    }

    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      params: req.query
    };

    if (!allowedMethods.includes(req.method)) {
      return send(Response.notAllowed());
    }

    const errors = validators
      ?.filter(rule => !rule.validate(request))
      .map(({ failureMessage }) => failureMessage);

    if (errors?.length > 0) {
      return send(Response.badRequest({ errors }));
    }

    try {
      const response = await endpoint({
        logger,
        ...request
      });

      return send(response);
    } catch (err) {
      logger.error(err.message, { error: err });
      return send(Response.internalServerError());
    }
  };
}
