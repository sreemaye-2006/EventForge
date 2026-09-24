/**
 * Middleware to validate requests using validation schema
 * Can handle Zod schemas
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    
    try {
      if (schema.parse) {
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        return next();
      }
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors || error.message
      });
    }
  };
};

module.exports = validateRequest;
