using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Dal.Core;
using Negocio.Entities;
using Negocio;

namespace Controllers
{
  [Route("api/v1/proveedores")]
  public class ProveedoresController : Controller
  {

    [HttpGet("")]
    public IActionResult GetAll()
    {
      using( var __dbContex = new DbContext())
      {
        return Ok( 
          new Proveedores(__dbContex).Load()
                                     .ToJsonString()
        );
      }
    }

  }
}
