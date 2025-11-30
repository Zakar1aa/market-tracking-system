import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Backend doesn't use JWT tokens, so we don't add Authorization headers
  // Just pass the request through as-is
  return next(req);
};
