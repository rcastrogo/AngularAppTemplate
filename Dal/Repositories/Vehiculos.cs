
using Dal.Core;
using Dal.Core.Loader;
using Dal.Utils;
using System.Collections.Generic;
using System.Data;

namespace Dal.Repositories
{

  [RepoName("Dal.Repositories.VehiculosRepository")]
  public class VehiculosRepository : RepositoryBase {
  
      public VehiculosRepository(DbContext context) : base(context) { }
        
      public IDataReader GetItems(Dictionary<string, string> @params){
          return GetItems(__toQuery(@params));
      }

    private static string __toQuery(Dictionary<string, string> @params)
    {
      QueryBuilder builder = new QueryBuilder(@params);
      builder.AndListOfIntegers("Id", "Ids");
      builder.AndString("Matricula");
      builder.AndStringLike("Marca");
      builder.AndStringLike("Modelo");
      return builder.ToQueryString();
    }

    public int Insert(string matricula, 
                      string marca, 
                      string modelo){
   
      return Insert( new string[] { Helper.ParseString(matricula),
                                    Helper.ParseString(marca),
                                    Helper.ParseString(modelo)});      
                
    }
    
    public int Update(int id, 
                      string matricula, 
                      string marca, 
                      string modelo){			         
      return Update( new string[] { id.ToString(),
                                    Helper.ParseString(matricula),
                                    Helper.ParseString(marca),
                                    Helper.ParseString(modelo)});           
    }

  }
}
    
