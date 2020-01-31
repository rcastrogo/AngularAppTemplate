
using Dal.Core;
using Dal.Repositories;
using Negocio.Core;
using System.Collections.Generic;

namespace Negocio.Entities
{
  [System.Xml.Serialization.XmlRoot("Proveedores")]
  public class Proveedores : EntityList<Proveedor>
  {
    public Proveedores() { }

    public Proveedores(DbContext context) : base(context) { }

    public Proveedores Load()
    {
      using (ProveedoresRepository repo = new ProveedoresRepository(base.DataContext))
      {
        return (Proveedores)repo.Load<Proveedor>(this, repo.GetItems());
      }
    }

    public Proveedores Load(Dictionary<string, string> @params)
    {
      using (ProveedoresRepository repo = new ProveedoresRepository(base.DataContext))
      {
        return (Proveedores)repo.Load<Proveedor>(this, repo.GetItems(@params));
      }
    }
  }
}
