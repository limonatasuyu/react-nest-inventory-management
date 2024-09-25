import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { cacheKeys } from '../constants';

@Injectable()
export class CategoryInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const requestMethod = httpAdapter.getRequestMethod(request);
    if (requestMethod === 'GET') return undefined;

    if (requestMethod === 'DELETE') {
      const categoryDeleteCount = this.cacheManager.get(
        cacheKeys.category.delete,
      );
      this.cacheManager.set(
        cacheKeys.category.delete,
        categoryDeleteCount ? categoryDeleteCount + 1 : 1,
      );
    } else if (requestMethod === 'POST') {
      const categoryCreationCount = this.cacheManager.get(
        cacheKeys.category.create,
      );
      this.cacheManager.set(
        cacheKeys.category.create,
        categoryCreationCount ? categoryCreationCount + 1 : 1,
      );
    } else if (requestMethod === 'PUT') {
      const categoryUpdateCount = this.cacheManager.get(
        cacheKeys.category.update,
      );
      this.cacheManager.set(
        cacheKeys.category.update,
        categoryUpdateCount ? categoryUpdateCount + 1 : 1,
      );
    }

    return httpAdapter.getRequestUrl(request);
  }
}
