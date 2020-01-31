
using Dal.Core;
using Dal.Repositories;
using Negocio.Core;
using System;

namespace Negocio.Entities
{
  [Serializable()]
  public class Proveedor : Entity
  {

    public Proveedor(){ }
    public Proveedor(DbContext context) : base(context) { }
        
    public Proveedor Load(int id){    
      using (ProveedoresRepository repo = new ProveedoresRepository(DataContext)){
        return repo.LoadOne<Proveedor>(this, repo.GetItem(id));
      }   
    }

    public Proveedor Save(){
      using (ProveedoresRepository repo = new ProveedoresRepository(DataContext)){
        if(_id == 0){
          _id = repo.Insert(Nif, Nombre, Descripcion);
        } else{
          repo.Update(Id, Nif, Nombre, Descripcion);
        }
        return this;
      }
    }
             
    public void Delete(){
      using (ProveedoresRepository repo = new ProveedoresRepository(DataContext)){
        repo.Delete(_id);
      }
    }

    int _id;
    public override int Id
    {
      get { return _id; }
      set { _id = value; }
    }

    String _nif;
    public String Nif
    {
      get { return _nif; }
      set { _nif = value; }
    }

    String _nombre;
    public String Nombre
    {
      get { return _nombre; }
      set { _nombre = value; }
    }

    String _descripcion;
    public String Descripcion
    {
      get { return _descripcion; }
      set { _descripcion = value; }
    }

    String _fechaDeAlta;
    public String FechaDeAlta
    {
      get { return _fechaDeAlta; }
      set { _fechaDeAlta = value; }
    }

  }
}
