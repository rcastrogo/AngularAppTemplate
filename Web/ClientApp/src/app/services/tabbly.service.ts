import { Injectable } from '@angular/core';
import { utils } from '@extensions';
import { StaticInjector } from '@angular/core/src/di/injector';

@Injectable()
export class TabblyService {

  private __context  = { headers : [], groups : [], details : [] };
  private __cur      = [{ columns : []}];
  private __func     = '';
  private __funcBody = '';

  private BS:any = {};

  parse(code : string) : any {
    this.__context  = { headers : [], groups : [], details : [] };
    code.split('\n')
        .forEach( (l) => {
          this.__parseLine(l.trim(),l)(this.__context);
        });
    return { context : this.__context, html : this.render(this.__context) };
  }

  private __parseLine(l : string, o) : any{
    const __that = this;
    if(!__that.__func && !l.trim()) return function(){};
    var __keys = /^(DEFINE|#|ADD_COL|CREATE|FUNCTION|END)/;
    if(__keys.test(l)){
      if(/^#/.test(l)){
        return function(){};
      }else if(/^FUNCTION (\w.*)/.test(l)){  
        var __tokens = l.match(/^FUNCTION (\w.*)$/);
        __that.__func     = __tokens[1].trim();
        __that.__funcBody = '';
        return function(){};
      }else if(/^END/.test(l)){      
        var __body = __that.__funcBody;
        var __name = __that.__func;
        __that.__func = __that.__funcBody = ''; 
        return function(){            
          return function(ctx){ ctx[__name] = new Function('ctx', __body); }
        }(); 
      }else if(/^ADD_COL /.test(l)){
        var __tokens = l.match(/ADD_COL (.*)$/); 
        return function(){ 
          var tokens = __tokens;
          return function(ctx){ __that.__cur[__that.__cur.length - 1].columns.push(__that.__parse_cell(tokens[1])); }
        }();        
      }else if(/^DEFINE\s\s*(\w.*)\s*=\s*(.*)$/.test(l)){
        var __tokens = l.match(/^DEFINE\s\s*([a-zA-Z0-9_\-]*)\s*=\s*(.*)$/);
        return function(){ 
          var tokens = __tokens;
          return function(ctx){ ctx[tokens[1].trim()] = tokens[2].trim(); }
        }();
      }else if(/^CREATE\s\s*(\w*) (.*)$/.test(l)){
        var __tokens = l.match(/^CREATE\s\s*(\w*) (.*)$/);
        if(__tokens[1]=='header'){
          return function(){ 
            var tokens = __tokens;
            return function(ctx){ ctx.headers.push(__that.__parse_row(tokens[2])); __that.__cur = ctx.headers;}
          }();
        }
        else if(__tokens[1]=='group'){
          return function(){ 
            var tokens = __tokens;
            return function(ctx){ ctx.groups.push(__that.__parse_row(tokens[2])); __that.__cur = ctx.groups; }
          }();
        }else if(__tokens[1]=='detail'){
          return function(){ 
            var tokens = __tokens;
            return function(ctx){ ctx.details.push(__that.__parse_row(tokens[2])); __that.__cur = ctx.details;}
          }();
        }else{
          return function(){ 
            var tokens = __tokens;
            return function(ctx){ ctx[tokens[1]] = tokens[2]; }
          }();          
        }
      }else{ throw new Error('Tabbly : Unrecognized text after DEFINE')}  
    }else{ 
      if(__that.__func){
        __that.__funcBody += o;
        __that.__funcBody += '\n';
        return function(){};
      }
      throw new Error('Tabbly : Unrecognized text')
    }
  }

  private __parse_properties(value : string) : any{
    var __reg = /(id|colspan|rowspan|className|html|xbind|style|key|header|tag):('[^']*'|[^\s]*)/g;
    var __o = {};
    var __match = __reg.exec(value);
    while (__match != null) {
      __o[__match[1]] = this.getValue(__match[2].replace(/^'([^']*)'$/g, '$1'));
      __match = __reg.exec(value);
    }
    return __o
  }

  private __parse_cell(value : string) : any{
    return this.__parse_properties(value);
  }

  private __parse_row(value : string) : any{
    var __properties = this.__parse_properties(value);
    __properties.columns = [];
    return __properties;
  }
  
  private getValue(value : string) : string {
    if(value && value.trim().startsWith('@')){
      return this.__context[value.trim().split('@')[1].trim()] || '';
    }else if(value){
      return value.trim();
    }
    return '';
  }  

  private getAttributes(data) : string {
    var __attributes : string[] = [];
    Object.keys(data)
          .filter ( (key) => { return key != 'columns' && key != 'html' && data.hasOwnProperty(key); })
          .forEach( (key) => {
            var __k = key == 'className' ? 'class' : key;
            __attributes.push('{0}="{1}"'.format( __k, this.getValue(data[key]))); 
          });
    return __attributes.length > 0 ? ' ' +__attributes.join(' ') : '';
  }
      
  private render(ctx : any) : string {
    const __that = this;
    function fill(data : any[], hide? : string[], header?: boolean){   
      var sb = '';
      var cellTag = header ? 'th' : 'td';
      (data || []).forEach((row, i) => {
        var sb_row = '';
        sb_row += '\n      <tr{0}>'.format(__that.getAttributes(row));
        row.columns.forEach( (col,i) => {
          sb_row += '\n        <{2}{0}>{1}</{2}>'.format(__that.getAttributes(col), __that.getValue(col.html), cellTag);
        });
        sb_row += '\n      </tr>';
        row.html = sb_row;
        if(hide && hide.indexOf(i.toString()) > -1) return;
        sb += sb_row;      
      });
      return sb;  
    }
    
    return ('<div id="{3}">\n' +
            '  <table class= "w3-table-all" style = "width:100%;" id="table-{3}" >\n ' +
            '    <thead>{0}' +
            '    </thead>\n' +
            '    <tbody>{1}{2}' +
            '    </tbody>\n' +
            '  </table>\n' +
            '</div>').format( fill(ctx.headers, (ctx.hiddenHeaders || '').split(','), true), 
                              fill(ctx.details),
                              fill(ctx.groups),
                              ctx.tableId || '');
  }

  // ========================================================================================
  // Reports
  // ========================================================================================
  private __cloneRowTemplate(e) {
    var __row = e.cloneNode(true);
    e.parentNode.parentNode.deleteRow(e.rowIndex);
    return __row;
  }

  private __mergeTemplate(template, sb, context, onGroupFooter) {
    if (template.forEach) return template.forEach( (t, i) => { this.__mergeTemplate(t, sb, context[i], onGroupFooter); });
    utils.fillTemplate(template, this);

    if (context.tag || context.tag == 'nofooter') {
      return;
    }
    sb.append(template.outerHTML.replace(/xbind="[^"]*"/g, ''));
    if (onGroupFooter) {
      onGroupFooter({ "sb": sb, "section": context });
    }
  }

  private module_ReportEngine_processAll = function (o) {
    var __that = this;
    var __doc = document.createDocumentFragment();
    __doc.appendChild(utils.$$('div', { innerHTML: o.ReportTemplate }));
    o.DetailTemplate = __that.__cloneRowTemplate(__doc.querySelector(o.DetailTemplateSelector));
    if (o.HideTotal) {
      var __row = __doc.querySelector(o.TotalTemplateSelector);
      __row.parentNode.removeChild(__row);
    } else {
      o.TotalTemplate = __that.__cloneRowTemplate(__doc.querySelector(o.TotalTemplateSelector));
    }
    o.GroupsTemplates = [];
    o.GroupsTemplates = o.Grupos.map((g) => __that.__cloneRowTemplate(__doc.querySelector(g.selector)) );

    var _g_id = -1;
    function __DoHeaders() {
      o.Grupos.forEach( (grupo, ii) => {
        if (ii < _g_id) return;
        var g = o.Grupos[ii];
        if (g.header) {
          var __header = utils.getValue(g.header, __that)(g.current, g.name);
          if (__header != 'hidden;') {
            if (__header.text) {
              _sb.append('<tr {0}>{1}</tr>'.format(__header.attributes, __header.text));
            } else if (__header.row) {
              __that.BS.reportDefinition.dom_tbody.appendChild(__header.row);
            } else {
              _sb.append('<tr class="group-header">{0}</tr>'.format(__header));
            }
          }
          if (o.RepeatHeadersAfter == ii) {
            o.RepeatHeaders.forEach(function (index) {
              if (index != '') _sb.append(o.Headers[index].html);
            })
          }
        }
      });
    }

    var _sb = utils.createStringBuilder('');
    o.OnStart(o.DataSet);
    o.DataSet.forEach( (r, i) => {
      if (i == 0) __DoHeaders();
      o.OnRow(r);
      if (o.Grupos.every(function (g) { return g.test(r) })) {
        o.Grupos.forEach(function (g) {
          g.sum(r);
        });
      } else {
        o.Grupos.some( (g, i) => {
          if (!g.test(r)) {
            _g_id = i;
            var __templates = o.GroupsTemplates.map(function (t) { return t; });
            __templates.splice(0, i)
            __templates.reverse();
            var __groups = o.Grupos.map(function (g) { return g; });
            __groups.splice(0, i)
            __groups.reverse();
            this.__mergeTemplate(__templates, _sb, __groups, o.OnGroupFooter);
            o.Grupos.forEach( (grupo, ii) => {
              if (ii >= i) {
                grupo.init(r)
                _g_id = i;
              } else {
                grupo.sum(r);
              }
            });
            return true;
          }
          return false;
        })
        o.OnRowEnd(r);
        __DoHeaders()
      }
      if (o.HideDetail) return;
      this.__mergeTemplate(o.DetailTemplate, _sb, { name: 'detail' }, o.g);
    });
    if (o.DataSet.length > 0) {
      __that.BS.previous = __that.BS.data;
      var __templates = o.GroupsTemplates.map(function (t) { return t; });
      __templates.reverse();
      if (!o.HideTotal) __templates.push(o.TotalTemplate);
      var __groups = o.Grupos.map(function (g) { return g; });
      __groups.reverse();
      __groups.push({ name: 'summary' });
      __that.__mergeTemplate(__templates, _sb, __groups, o.OnGroupFooter);
    }

    return __doc.querySelector(o.ReportTableSelector)
                .innerHTML
                .replace('<tbody>', '<tbody>' + _sb.value);    
  }

  fromReportDefinition = function (rd, data, callback: (html: string) => void) {
    var __that = this;
    this.BS = { reportDefinition: rd };
    // ================================================================================================
    // Ordenar los datos
    // ================================================================================================
    if (rd.context.Iteratefn) data.forEach(rd.context.Iteratefn);
    if (rd.context.orderBy) data.sortBy(rd.context.orderBy, false);
    // ================================================================================================
    // Inicializar los grupos
    // ================================================================================================
    var __summary = JSON.parse(rd.context.summary || '{}');
    function __createGroups() {
      return rd.context
        .groups
        .where(function (g, i) { return i < rd.context.groups.length - 1; })
        .map((g, i) => {
          return {
            name: 'G' + (i + 1),
            selector: '#' + g.id,
            key: g.key,
            tag: g.tag || '',
            current: '',
            header: g.header,
            data: utils.clone(__summary),
            init: function (value){
              var __k = value[this.key].toString();
              var __BS_Name = __that.BS[this.name];
              __BS_Name.all[__k] = __BS_Name.all[__k] || [];;
              __BS_Name.all[__k].push(value);
              __BS_Name.recordCount = 1;
              __that.module_ReportEngine_Copy(value, this.data);
            },
            sum: function(value){
              var __k = value[this.key].toString();
              var __BS_Name = __that.BS[this.name];
              __BS_Name.all[__k] = __BS_Name.all[__k] || [];;
              __BS_Name.all[__k].push(value);
              __BS_Name.recordCount += 1;
              __that.module_ReportEngine_Sum(value, this.data);
            },
            test: function (value) { return value[this.key] == this.current; }
          }
        }) || []; 
    }
    // ================================================================================================
    // Inicializar el informe e imprimirlo
    // ================================================================================================
    var __wrapper = {
      DataSet: data,
      HideDetail: rd.context.hideDetail == 'true' || false,
      HideTotal: rd.context.groups.length == 0 || rd.context.HideTotal == 'true' || false,
      ReportTemplate: rd.html,
      ReportTableSelector: '#' + rd.context.tableId,
      DetailTemplateSelector: '#' + rd.context.details[0].id,
      TotalTemplateSelector: rd.context.groups.length == 0 ? '' : '#' + rd.context.groups.lastItem().id,
      Grupos: __createGroups(),
      OnGroupFooter: rd.context.OnGroupFooter,
      Headers: rd.context.headers,
      RepeatHeaders: (rd.context.repeatHeader || '').split(','),
      RepeatHeadersAfter: rd.context.repeatHeaderAfter,
      OnRow: (data) => {
        __that.BS.recordCount += 1;
        __that.BS.previous = __that.BS.data || data;
        __that.BS.data = data;
        __wrapper.Grupos.forEach((g, i) => { __that.BS[g.name].data = Object.create(g.data); });
        __that.module_ReportEngine_Sum(data, __that.BS.G0);
        if (rd.context.onRowfn) (new Function('ctx', rd.context.onRowfn)(this.BS));
      },
      OnStart: (dataSet) => {
        __that.BS = {
          recordCount: 0,
          G0: utils.clone(__summary),
          dataSet: dataSet,
          reportDefinition: __that.BS.reportDefinition
        };
        __wrapper.Grupos.forEach((g, i) => {
          g.current = (dataSet && dataSet[0]) ? dataSet[0][g.key] : '';
          __that.BS[g.name] = { recordCount: 0, all: {} };
        });
        if (rd.context.onStartfn) rd.context.onStartfn(__that.BS);
      },
      OnRowEnd: function (data) {
        __wrapper.Grupos.forEach(function (g) { g.current = data[g.key]; });
        if (rd.context.onRowEndfn) (new Function('ctx', rd.context.onRowEndfn)(__that.BS));
      },
      PrintReport: (callback) => {
        if (callback) callback(this.module_ReportEngine_processAll(__wrapper));
        return this;
      }
    };
    return __wrapper.PrintReport(callback);
  }

  private module_ReportEngine_Copy = function (source, dest) {
    for (var p in dest) {
      if (dest.hasOwnProperty(p)) {
        if (source.hasOwnProperty(p)) {
          dest[p] = source[p];
          continue;
        }
        if (p === '_max_' || p === '_mim_') {
          var __max = dest[p];
          for (var m in __max) {
            if (__max.hasOwnProperty(m) && source.hasOwnProperty(m)) __max[m] = source[m];
          }
        }
        if (p === '_values_') {
          var __agregate = dest[p];
          for (var m in __agregate) {
            if (__agregate.hasOwnProperty(m) && source.hasOwnProperty(m)) {
              __agregate[m] = [source[m]];
            }
          }
        }
      }
    }
  }

  private module_ReportEngine_Sum = function (source, dest) {
    for (var p in dest) {
      if (dest.hasOwnProperty(p)) {
        if (source.hasOwnProperty(p)) {
          dest[p] += source[p];
          continue;
        }
        if (p === '_max_' || p === '_min_') {
          var __max = dest[p];
          for (var m in __max) {
            if (__max.hasOwnProperty(m) && source.hasOwnProperty(m)) {
              if (p == '_max_')
                __max[m] = source[m] > __max[m] ? source[m] : __max[m];
              else
                __max[m] = source[m] < __max[m] ? source[m] : __max[m];
            }
          }
        }
        if (p === '_values_') {
          var __agregate = dest[p];
          for (var m in __agregate) {
            if (__agregate.hasOwnProperty(m) && source.hasOwnProperty(m)) __agregate[m].add(source[m]);
          }
        }
      }
    }
  }

  private module_ReportEngine_Compute = function (d, t) {
    return d.reduce(function (p, c) { return p + c[t]; }, 0.0);
  }

  private module_ReportEngine_Group = function (a, c) {
    var dataSet = a, ctx = c;
    var __f = function (k, t) {
      dataSet.distinct(function (v) { return v[k]; })
        .forEach(function (v) { c[v] = dataSet.reduce(function (p, c, i, a) { return (c[k] == v) ? p + c[t] : p; }, 0.0); });
      return __f;
    }
    return __f;
  }

}
