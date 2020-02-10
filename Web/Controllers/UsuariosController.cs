using Dal.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Negocio;
using Negocio.Entities;
using System;

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

        [HttpPost()]
    public IActionResult Save([FromBody] Usuario target)
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
    public IActionResult Update([FromBody] Usuario data)
    {
      using( var __dbContext = new DbContext()) { 
        Usuario __target = new Usuario( __dbContext).Load(data.Id);
        if(__target.Id == 0) return NotFound();
        __target.Nif = data.Nif;
        __target.Nombre = data.Nombre;
        __target.Descripcion = data.Descripcion;
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
        Usuario target = new Usuario(__dbContex).Load(id);
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
