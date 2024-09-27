import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SortOrder } from '../constants/sortOrder';

export class QueryParamsDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pageSize = 10;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  page = 0;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt'])
  sortBy = 'createdAt';

  @IsOptional()
  @IsIn([SortOrder.ASC, SortOrder.DESC])
  sortOrder: SortOrder = SortOrder.DESC;

  @IsOptional()
  @IsString()
  search?: string;
}
