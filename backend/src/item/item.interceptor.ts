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

    this.handleCaches(requestMethod);
    return request;
  }

  private async handleCaches(requestMethod: string) {
    if (requestMethod === 'DELETE') {
      const itemDeleteCount =
        (await this.cacheManager.get(cacheKeys.item.delete)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.item.delete,
        itemDeleteCount ? itemDeleteCount + 1 : 1,
      );
    } else if (requestMethod === 'POST') {
      const itemCreationCount =
        (await this.cacheManager.get(cacheKeys.item.create)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.item.create,
        itemCreationCount ? itemCreationCount + 1 : 1,
      );
    } else if (requestMethod === 'PUT') {
      const itemUpdateCount =
        (await this.cacheManager.get(cacheKeys.item.update)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.item.update,
        itemUpdateCount ? itemUpdateCount + 1 : 1,
      );
    }
  }
}
