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

    this.handleCaches(requestMethod);
    return request;
  }

  private async handleCaches(requestMethod: string) {
    /*if (requestMethod === 'DELETE') {
      const supplierDeleteCount =
        (await this.cacheManager.get(cacheKeys.supplier.delete)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.supplier.delete,
        supplierDeleteCount ? supplierDeleteCount + 1 : 1,
      );
    } else */if (requestMethod === 'POST') {
      const supplierCreationCount =
        (await this.cacheManager.get(cacheKeys.supplier.create)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.supplier.create,
        supplierCreationCount ? supplierCreationCount + 1 : 1,
      );
    } else if (requestMethod === 'PUT') {
      const supplierUpdateCount =
        (await this.cacheManager.get(cacheKeys.supplier.update)) ?? 0;
      await this.cacheManager.set(
        cacheKeys.supplier.update,
        supplierUpdateCount ? supplierUpdateCount + 1 : 1,
      );
    }
  }
}
