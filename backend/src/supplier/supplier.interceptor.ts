import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { cacheKeys } from '../constants';

@Injectable()
export class SupplierInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const requestMethod = httpAdapter.getRequestMethod(request);
    if (requestMethod === 'GET') return undefined;

    /*if (requestMethod === 'DELETE') {
      const orderDeleteCount = this.cacheManager.get(cacheKeys.order.delete);
      this.cacheManager.set(
        cacheKeys.order.delete,
        orderDeleteCount ? orderDeleteCount + 1 : 1,
      );
    } else*/
    if (requestMethod === 'POST') {
      const orderCreationCount = this.cacheManager.get(cacheKeys.order.create);
      this.cacheManager.set(
        cacheKeys.order.create,
        orderCreationCount ? orderCreationCount + 1 : 1,
      );
    } else if (requestMethod === 'PUT') {
      const orderUpdateCount = this.cacheManager.get(cacheKeys.order.update);
      this.cacheManager.set(
        cacheKeys.order.update,
        orderUpdateCount ? orderUpdateCount + 1 : 1,
      );
    }

    return httpAdapter.getRequestUrl(request);
  }
}
