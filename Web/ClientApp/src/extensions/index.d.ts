
declare interface UtilsConstructor {
  apply(a: any, b: any, d?: any);
  isNull(v: any): boolean;
  toArray(v: any): any[];
  isArray(v: any): boolean;
  isString(v: any): boolean;
  isBoolean(v: any): boolean;
  isNumber(v: any): boolean;
  isFunction(v: any): boolean;
  isObject(v: any): boolean;
  clone(o: any): any;
  join(items: any[], property: string, separator?: string): string;
  createStringBuilder(s: string): stringBuilder;
  getValue(key: string, scope?: any): any;
  $(e: string | HTMLElement, control?: HTMLElement): HTMLElement | any[];
  $$(element: string, o: object): HTMLElement;
  fillTemplate(e: string | HTMLElement, context: object): HTMLElement;
  executeTemplate(e: string | HTMLElement, values: any[], dom?: boolean): any;
}

declare interface stringBuilder {
  value: string;
  append(s: string): stringBuilder
  appendLine(s: string): stringBuilder
}
// ============================================================
// String.prototype
// ============================================================
declare interface String {
  format(...values: any[]): string;
  replaceAll(pattern: string, replacement: string): string;
  fixDate(): string;
  fixTime(): string;
  fixYear(): string;
  paddingLeft(v: string): string;
  merge(context?: object): string;
  toXmlDocument(): Document;
}
// ============================================================
// String.prototype
// ============================================================
declare interface Array<T> {
  remove(o: T): T[];
  add(o: T): T;
  append(o: T): T[];
  select(sentence: string | Function): T;
  item(propName: string, value: any, def: any): T;
  contains(propName: string, value: any): T;
  lastItem(): T;
  where(sentence: object | Function): T[];
  sortBy(propname: string, desc?: boolean): T[];
  orderBy(sentence: string | Function): T[];
  distinct(sentence: string | Function): T[];
  groupBy(propName: string): object;
  toGroupWrapper(context : string) : (g: string, prop: string, name: string) => any;
  sum(prop : string) : any;
  toDictionary(propName: string, value?: string): object;
}

declare interface PaginationInfo {
  totalItems: number,
  currentPage: number,
  pageSize: number,
  totalPages: number,
  startIndex: number,
  endIndex: number,
  allItems: any[],
  visibleItems: any[],
  title:string
};
