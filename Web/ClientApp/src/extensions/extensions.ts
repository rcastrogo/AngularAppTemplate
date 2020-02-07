
class Utils implements UtilsConstructor{

  isNull    (v : any) : boolean { return v === null;}
  toArray   (v : any) : any[] { return Array.prototype.slice.call(v); }
  isArray   (v : any) : boolean {return Array.isArray(v); }
  isString  (v : any) : boolean { return typeof v == 'string'; }
  isBoolean (v : any) : boolean { return typeof v == 'boolean'; }
  isNumber  (v : any) : boolean {return typeof v == 'number';}
  isFunction(v : any) : boolean {return typeof v == 'function';}
  isObject  (v : any) : boolean {return v && typeof v == 'object';}
  
  apply(a : any, b : any, d? : any) {
    if(d) this.apply(a, d);
    if(a && this.isObject(b)){
      for (var p in b){
        if(this.isObject(b[p])){                  
          this.apply(a[p] = a[p] || {}, b[p]);
        } else{      
          a[p] = b[p];
        }
      }
    }
    return a;
  };

  clone(o : any){
    if(this.isArray(o))             return o.slice(0);
    if(this.isObject(o) && o.clone) return o.clone();
    if(this.isObject(o)){               
      return Object.keys(o)
                   .reduce( (a, k) => {
        a[k] = this.clone(o[k]);
        return a;
      }, {});
    }
    return o;
  }       
  join(items : any[], property : string, separator? : string) : string{
    return items.reduce( (a, o) => { return a.append(o[property || 'id']); }, [])
                .join(separator === undefined ? '-' : (separator || '')); 
  }
  createStringBuilder(s : string) : stringBuilder{
    return { value      : s || '',
             append     : function(s : string){ this.value = this.value + s; return this;},
             appendLine : function(s : string){ this.value = this.value + (s || '') + '\n'; return this;}}
  }

  getValue(key : string, scope? : any) : any {  
    if(key == 'this') return scope;
    return key.split(/\.|\[|\]/)
              .reduce( function(a, b){
                if (b === '') return a;
                return a[b] || window[b] || '{{0}}'.format(key);
              }, scope || window ); 
  }

  $(e : string | HTMLElement, control? : HTMLElement): HTMLElement | any[]{ 
    return this.isString(e) ? document.getElementById(e as string) || 
                              this.toArray((control || document).querySelectorAll(e as string) || [])
                            : e as HTMLElement;
  }; 

  $$(tagName : string, options : object) {
    return this.apply(document.createElement(tagName), options);   
  };

  fillTemplate(e : string | HTMLElement, scope : any) {  
    var _trim = function(values : string []){ return values.map( (s : string) => { return s.trim(); }); } 
    var _root = this.$(e) as HTMLElement;
    var _elements = this.$('[xbind]', _root) as any[]; 
    if ((_root.attributes as any).xbind) _elements.push(_root);
    _elements.forEach( (child) => {
      _trim(child.attributes.xbind.value.split(';')).forEach((token) => {
        if (token === '') return;
        var _tokens = _trim(token.split(':'));            
        var _params = _trim(_tokens[1].split(/\s|\,/));
        var _value  = this.getValue(_params[0], scope);
        if (this.isFunction(_value)) {
          var _args = _params.slice(1)
                             .reduce( (a, p) => {
                               // xbind="textContent:Data.fnTest @PlainObject,A,5"
                               a.push(p.charAt(0) == '@' ? this.getValue(p.slice(1), scope) : p);
                               return a;
                             }, [scope, child]);
          _value = _value.apply(scope, _args);
        } else if (_params[1]) {
          var _func = this.getValue(_params[1], scope);
          _value = _func(_value, _params[2], scope, child);
        }
        child[_tokens[0]] = _value;
      });
    });
    return _root;
  }

  executeTemplate(e : string | HTMLElement, values : any, dom? : boolean) {
    var _template = this.$(e) as HTMLElement;
    var _result   = values.reduce( (a : any, v : any, i : number) => {
      var _node = { index : i,
                    data  : v,
                    node  : this.fillTemplate(_template.cloneNode(true) as HTMLElement, v) };
      a.nodes.push(_node);
      a.html.push(_node.node.outerHTML.replace(/xbind="[^"]*"/g, ''));
      return a; 
    }, { nodes : [], html : [] });
    return dom ? _result.nodes : _result.html.join('');
  }

}

export const utils = new Utils();

// =================================================================================================
// Strings.prototype
// =================================================================================================
String.prototype.format = function(...values) {     
  var __data = values[values.length - 1] || self;     
  return this.replace(/\{(\d+|[^{]+)\}/g, function(m, key){
    if(key.indexOf(':') > 0){
      var __fn = key.split(':');
      __fn[0] = utils.getValue(__fn[0].trim(), __data);
      __fn[1] = utils.getValue(__fn[1].trim(), __data);
      return __fn[0](__fn[1], __data);            
    }
    return /^\d+$/.test(key) ? values[key]
                             : (typeof __data[key] === "undefined") ? utils.getValue(key, __data) 
                                                                    : __data[key]; 
  });
}
String.prototype.replaceAll  = function(pattern : string, replacement : string) { return (this as string).split(pattern).join(replacement); }
String.prototype.fixDate     = function(){ return this.split(' ')[0]; }
String.prototype.fixTime     = function(){ return this.split(' ')[1]; }
String.prototype.fixYear     = function(){ return this.fixDate().split('/')[2];}
String.prototype.paddingLeft = function(v){ return (v + this).slice(-v.length); };
String.prototype.merge       = function(context) {
  var __result = (this as string).replace(/{([^{]+)?}/g, function (m, key : string) {
                  if(key.indexOf(':') > 0){
                    var __tokens = key.split(':');                       
                    var __fn     = utils.getValue(__tokens[0], context);
                    var __value  = utils.getValue(__tokens[1], context);                        
                    return __fn(__value, context);            
                  }
                  var r   = utils.getValue(key, context);                                     
                  return typeof (r) == 'function' ? r(context) : r;
                });     
  return __result;
}

String.prototype.toXmlDocument = function() {
  return new DOMParser().parseFromString(this, "text/xml");  
}
// =================================================================================================
// Array.prototype
// =================================================================================================
Array.prototype.remove = function(o) {
  var index = this.indexOf(o);
  if (index != -1) this.splice(index, 1);
  return this;
}
Array.prototype.add = function(o) {
  this.push(o);
  return o;
}
Array.prototype.append = function(o) {
  this.push(o);
  return this;
}
Array.prototype.select = function(sentence : string | Function ) : any{ 
  return utils.isString(sentence) ? this.map(function(e : string){return e[sentence as string];})
                                  : this.map(sentence);
}
Array.prototype.item   = function(propName : string, value : any, def? : any){
  return this.filter( (v : any) => {
    return v[propName] == value;
  })[0] || def;
}
Array.prototype.contains = function(propName : string, value : any){ return this.item(propName,value); };
Array.prototype.lastItem = function(){ return this[this.length - 1]; };
Array.prototype.where    = function(sentence){ 
  if (utils.isFunction(sentence)) return this.filter(sentence);
  if (utils.isObject(sentence)){
    return this.filter(new Function('a', Object.keys(sentence)
                                               .reduce(function(a, p, i){
                                                         return a + (i > 0 ? ' && ' : '')
                                                                  + ((sentence[p] instanceof RegExp) ? '{1}.test(a.{0})'.format(p, sentence[p])
                                                                                                     : 'a.{0} == \'{1}\''.format(p, sentence[p]));                                         
                                                       }, 'return ')));
  }
  return this;
}
Array.prototype.sortBy = function(propname, desc){
  var __order = [];
  var __names = propname.split(',').map( function(token,i){ 
    var __pair = token.split(' ');
    __order[i] = (__pair[1] && (__pair[1].toUpperCase()=='DESC')) ? -1 : 1;      
    return __pair[0];    
  });
  __order[0] = (desc ? -1 : 1)
  this.sort(function(a, b){
              var i = 0;                 
              var __fn = function(a, b){
                var __x = a[__names[i]];
                var __y = b[__names[i]];
                if(__x < __y) return -1 * __order[i];
                if(__x > __y) return  1 * __order[i];
                i++;
                if(i<__names.length) return __fn(a,b);       
                return 0;               
              }
              return __fn(a,b);                                  
            });
  return this;    
}
Array.prototype.orderBy = function(sentence){
  var __sentence = utils.isString(sentence) ? function(a : any){ return a[sentence as string]; }
                                            : sentence as Function;    
  return this.map(function(e : any){ return e; })
             .sort(function(a : any, b : any){
                var x = __sentence(a);
                var y = __sentence(b);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
             });
  
}
Array.prototype.distinct = function(sentence = '') {  
  var __sentence = utils.isString(sentence) ? function(a : any){ return sentence ?  a[sentence as string] : a ; }
                                            : sentence as Function; 
  var r = [];
  this.forEach((item : any) => {
    var _value = __sentence(item);
    if(r.indexOf(_value)==-1) r.push(_value);
  });
  return r;
}

Array.prototype.groupBy = function(prop : string) : object{
  return this.reduce(function(groups : object, item : any) {
    var val = item[prop];
    (groups[val] = groups[val] || []).push(item);
    return groups;
  }, {});
}

Array.prototype.toGroupWrapper = function(ctx: any){
	  var dataSet = this;
	  var __f = function(k, t, name){
      ctx[name] = {};
	    dataSet.distinct( function(v){ return v[k]; })	            
	           .forEach ( function(v){
               ctx[name][v] = dataSet.reduce( function(p, c, i, a){
                 return (c[k]==v) ? p + c[t] : p;
               }, 0.0);
             });
      return __f;	           
	  }
	  return __f;
	}

Array.prototype.sum = function (prop: string) {
  return this.reduce(function (a, item) { return a + item[prop]; }, 0.0);
}

Array.prototype.toDictionary = function(prop : string, value? : string) : object{
  return this.reduce(function(a, d){
                      a[d[prop]] = value ? d[value] : d;
                      return a;
                    }, {});  
}
