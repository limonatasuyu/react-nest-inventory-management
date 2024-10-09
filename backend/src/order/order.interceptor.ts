import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { cacheKeys } from '../constants';

@Injectable()
export class OrderInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const requestMethod = httpAdapter.getRequestMethod(request);
    if (requestMethod === 'GET') return undefined;

    this.handleCaches(requestMethod);
    return request;
  }

  private async handleCaches(requestMethod: string) {
    /*if (requestMethod === 'DELETE') {
      const orderDeleteCount =
        (await this.cacheManager.get(cacheKeys.order.delete)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.order.delete,
        orderDeleteCount ? orderDeleteCount + 1 : 1,
      );
    } else */if (requestMethod === 'POST') {
      const orderCreationCount =
        (await this.cacheManager.get(cacheKeys.order.create)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.order.create,
        orderCreationCount ? orderCreationCount + 1 : 1,
      );
    } else if (requestMethod === 'PUT') {
      const orderUpdateCount =
        (await this.cacheManager.get(cacheKeys.order.update)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.order.update,
        orderUpdateCount ? orderUpdateCount + 1 : 1,
      );
    }
  }
}
