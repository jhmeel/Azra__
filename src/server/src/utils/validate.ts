import { Request, Response, NextFunction } from 'express';
const Validate = (schema:any) => (req:Request, res:Response, next:NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
  

  export default Validate