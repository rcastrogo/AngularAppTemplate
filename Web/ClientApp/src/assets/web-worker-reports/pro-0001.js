
'use strict'; 

(function(module){
 
  let __sourceCode = `
    # ==========================================================================
    # Definición de variables
    # ==========================================================================
    DEFINE summary   = { }
    DEFINE orderBy   = _descripcion,_nombre
             
    # ==========================================================================
    # Secciones de cabecera del informe
    # ==========================================================================
    CREATE section type:header id:PageHeader1 
    SET template
      <div class="rpt-report-header">
        Listado
      </div>
    END
       
    CREATE section type:header id:PageHeader2 
    SET template
      <div class="w3-center">
        <div class="w3-panel w3-pale-yellow w3-border w3-round w3-display-container">
            <span onclick="this.parentElement.style.display='none'"  class="w3-button w3-large w3-display-topright">&times;</span>
          <h3>Ubicación: </h3>
          <p>{self.location}</p>
        </div>
      </div>
    END
    # ==========================================================================
    # Grupo 01
    # ==========================================================================
    CREATE group key:_descripcion id:Group01_tipo
    SET header
      <h2 class="rpt-header">Grupo: {current}</h2>
    END
    SET footer
      <div>
        <div class="rpt-footer">
          {self.BS.G1.previous.id}
        </div>
        <div class="rpt-footer">{current} {self.BS.G1.recordCount} elementos</div>    
      </div>
    END
  
    # ==========================================================================
    # Seccion de detalle 1
    # ==========================================================================      
    CREATE detail id:Detail1
    SET template
      <div class="rpt-detail">
       {self.BS.data._id} {self.BS.data._nif} {self.BS.data._nombre} {self.BS.data._fechaDeAlta}
      </div>
    END
  
    # ==========================================================================
    # Seccion de Total General
    # ==========================================================================
    CREATE section type:total id:Total0 
    SET template
      <div style="background-color: navy; height:3px">
      </div>
    END
    CREATE section type:total id:Total1 
    SET template
      <div class="rpt-total">
        Total proveedores listados {self.BS.recordCount}
      </div>
    END
  `;

  module.ReportEngine.rd = module.tabbly.execute(__sourceCode);

  module.apply(module.ReportEngine.rd.context, {
    onInitSummaryObject : function(summary){ return summary;},
    iteratefn : function(ctx){ },
    onStartfn : function(ctx){
      ctx.fn = { };
    },
    onRowfn         : function(ctx){ },
    onGroupChangefn : function(ctx){ }
  });

  
})(self[__$__module_name]);
