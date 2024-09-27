export class Pagination<PaginationEntity> {
  records: PaginationEntity[];
  total: number;
  hasNext: boolean;

  constructor(
    records: PaginationEntity[],
    page: number,
    pageSize: number,
    total: number,
  ) {
    this.records = records;
    this.total = total;
    this.hasNext = (page + 1) * pageSize < total;
  }
}

export default Pagination;
