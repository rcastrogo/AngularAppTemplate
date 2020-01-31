using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Negocio.Entities;
using Dal.Core;

namespace Controllers
{
  [Route("api/v1/usuarios")]
  public class UsuariosController : Controller
  {

    [HttpGet("")]
    public IEnumerable<Usuario> GetAll()
    {
      using( var __dbContex = new DbContext())
      {
        return new Usuarios(__dbContex).Load();
      }
    }

  }
}
