import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class PasswordInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) return data;
        const removePassword = (obj: any) => {
          if (Array.isArray(obj)) {
            return obj.map((item) => removePassword(item));
          }
          if (obj && typeof obj === 'object') {
            const { password, ...rest } = obj;
            return Object.keys(rest).reduce(
              (acc, key) => ({
                ...acc,
                [key]: removePassword(rest[key]),
              }),
              {},
            );
          }
          return obj;
        };

        return removePassword(data);
      }),
    );
  }
}
