import { validationResult } from 'express-validator';


export default function middleware (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {return res.status(403).json({ errors: errors.array() });}

  next();
}
