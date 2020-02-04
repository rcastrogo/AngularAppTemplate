using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Negocio;
using Negocio.Entities;
using Dal.Core;

namespace Controllers
{
  [Route("api/v1/usuarios")]
  public class UsuariosController : Controller
  {

    [HttpGet("")]
    public IActionResult GetAll()
    {
      using( var __dbContex = new DbContext())
      {
        return Ok( 
          new Usuarios(__dbContex).Load()
                                  .ToJsonString()
        );
      }
    }

  }
}
