using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Dal.Core;
using Negocio.Entities;

namespace Controllers
{
  [Route("api/v1/proveedores")]
  public class ProveedoresController : Controller
  {

    [HttpGet("")]
    public IEnumerable<Coordinado> GetAll()
    {
      using( var __dbContex = new DbContext())
      {
        return new Coordinados(__dbContex).Load();
      }
    }

  }
}
