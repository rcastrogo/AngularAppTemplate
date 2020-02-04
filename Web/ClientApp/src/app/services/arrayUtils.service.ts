
export class ArrayUtilsService<T>{

  private _target : Array<T>;

  constructor(target: Array<T>) {
    this._target = target;
  }

  public sortBy(properties: string, desc: boolean): any[] {
    var __order = [];
    var __names = properties.split(',').map(function (token, i) {
      var __pair = token.split(' ');
      __order[i] = (__pair[1] && (__pair[1].toUpperCase() == 'DESC')) ? -1 : 1;
      return __pair[0];
    });
    __order[0] = (desc ? -1 : 1)
    this._target.sort(function (a, b) {
      var i = 0;
      var __fn = function (a, b) {
        var __x = a[__names[i]];
        var __y = b[__names[i]];
        if (__x < __y) return -1 * __order[i];
        if (__x > __y) return  1 * __order[i];
        i++;
        if (i < __names.length) return __fn(a, b);
        return 0;
      }
      return __fn(a, b);
    });
    return this._target.map( t => t );
  }

}
