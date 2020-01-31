using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Dal.Core;
using Negocio.Entities;

namespace Controllers
{
  [Route("api/v1/vehiculos")]
  public class VehiculosController : Controller
  {

    [HttpGet("")]
    public IEnumerable<Vehiculo> GetAll()
    {
      using( var __dbContex = new DbContext())
      {
        return new Vehiculos(__dbContex).Load();
      }
    }

  }
}
