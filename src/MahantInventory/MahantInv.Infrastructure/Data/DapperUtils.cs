using Dapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Infrastructure.Data
{
    public static class DapperUtils
    {
        public static string GetTableName(Type type)
        {
            string name;
            var tableAttrName =
                    type.GetCustomAttribute<TableAttribute>(false)?.Name
                    ?? (type.GetCustomAttributes(false).FirstOrDefault(attr => attr.GetType().Name == "TableAttribute") as dynamic)?.Name;

            if (tableAttrName != null)
            {
                name = tableAttrName;
            }
            else
            {
                name = type.Name;
                if (type.IsInterface && name.StartsWith("I"))
                    name = name[1..];
            }
            return name;
        }

        public static async Task<IEnumerable<TParent>> QueryParentChildAsync<TParent, TChild, TParentKey>(
            this IDbConnection connection,
            string sql,
            Func<TParent, TParentKey> parentKeySelector,
            Func<TParent, IList<TChild>> childSelector,
            dynamic param = null, IDbTransaction transaction = null, bool buffered = true, string splitOn = "Id", int? commandTimeout = null, CommandType? commandType = null)
        {
            Dictionary<TParentKey, TParent> cache = new();

            await connection.QueryAsync<TParent, TChild, TParent>(
                sql,
                (parent, child) =>
                {
                    var pKey = parentKeySelector(parent);

                    if (!cache.ContainsKey(pKey))
                    {
                        cache.Add(pKey, parent);
                    }

                    TParent cachedParent = cache[pKey];
                    IList<TChild> children = childSelector(cachedParent);
                    children.Add(child);
                    return cachedParent;
                },
                param as object, transaction, buffered, splitOn, commandTimeout, commandType);

            return cache.Values;
        }
    }
}
