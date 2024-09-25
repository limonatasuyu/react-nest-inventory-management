import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { cacheKeys } from '../constants';

@Injectable()
export class ItemInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const requestMethod = httpAdapter.getRequestMethod(request);
    if (requestMethod === 'GET') return undefined;

    if (requestMethod === 'DELETE') {
      const itemDeleteCount = this.cacheManager.get(cacheKeys.item.delete);
      this.cacheManager.set(
        cacheKeys.item.delete,
        itemDeleteCount ? itemDeleteCount + 1 : 1,
      );
    } else if (requestMethod === 'POST') {
      const itemCreationCount = this.cacheManager.get(cacheKeys.item.create);
      this.cacheManager.set(
        cacheKeys.item.create,
        itemCreationCount ? itemCreationCount + 1 : 1,
      );
    } else if (requestMethod === 'PUT') {
      const itemUpdateCount = this.cacheManager.get(cacheKeys.item.update);
      this.cacheManager.set(
        cacheKeys.item.update,
        itemUpdateCount ? itemUpdateCount + 1 : 1,
      );
    }

    return httpAdapter.getRequestUrl(request);
  }
}
