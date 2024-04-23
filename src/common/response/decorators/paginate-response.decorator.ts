import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiPaginatedResponse<TData>(options: {
  type: { new (): TData };
}) {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Paging response',
      content: {
        'application/json': {
          schema: {
            properties: {
              total_records: { type: 'number' },
              limit: { type: 'number' },
              page: { type: 'number' },
              total_pages: { type: 'number' },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        },
      },
    }),
    ApiProperty({
      type: [options.type],
      description: 'Data array',
    }),
  );
}
