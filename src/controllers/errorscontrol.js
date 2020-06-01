import server from '../config/config.server';


// Handle any errors that come up
export const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({
      status: 'error',
      data: err.message,
    });
  } else {
    return server.sendError(res, 500);
  }
};

// Handle case where user requests nonexistent endpoint
export const nullRoute = (req, res) => {
  return server.sendError(res, 404);
};

export const buggyRoute = (req, res, next) => {
  // Simulate a custom error

  const newHttpError = (status, message) => {
    let err;

    // Eliminates problem where a null message would get passed in and the final
    // error message would become 'null' (stringified null)
    if (message == null) {
      err = new Error();
    } else {
      err = new Error(message);
    }

    err.status = status;
    return err;
  };

  return next(newHttpError(400, 'Bad request'));
};

export const serverError = () => {
  // not defined function
  funcNotDefined = () => true;

  return funcNotDefined();
};
