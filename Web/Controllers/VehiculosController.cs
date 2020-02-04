using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Dal.Core;
using Negocio.Entities;
using Negocio;
using Microsoft.AspNetCore.Http;

namespace Controllers
{
  [Route("api/v1/vehiculos")]
  public class VehiculosController : Controller
  {

    [HttpGet("")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetAll()
    {
      using( var __dbContext = new DbContext())
      {
        return Ok( 
          new Vehiculos(__dbContext).Load()
                                    .ToJsonString()
        );
      }
    }

    [HttpPost()]
    public IActionResult Save([FromBody] Vehiculo target)
    {
      using( var __dbContext = new DbContext())
      {
        target.DataContext = __dbContext;
        target.Save();
        target.FechaDeAlta = DateTime.Now.ToString();
        return Ok(target.ToJsonString());
      }
    }

    [HttpPut()]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Update([FromBody] Vehiculo data)
    {
      using( var __dbContext = new DbContext()) { 
        Vehiculo __target = new Vehiculo( __dbContext).Load(data.Id);
        if(__target.Id == 0) return NotFound();
        __target.Marca = data.Marca;
        __target.Matricula = data.Matricula;
        __target.Modelo = data.Modelo;
        __target.Save();
        return Ok(__target.ToJsonString());
      }
    }

    [HttpDelete()]
    [Route("{id}")]
    public IActionResult Delete(int id)
    {
      using( var __dbContex = new DbContext())
      {
        Vehiculo target = new Vehiculo(__dbContex).Load(id);
        if (target.Id == 0)
        {
          return NotFound();
        }
        else
        {
          target.Delete();
          return Ok();
        }
      }
    }
  }
}
