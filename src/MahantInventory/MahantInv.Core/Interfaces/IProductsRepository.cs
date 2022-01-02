using MahantInv.Core.SimpleAggregates;
using MahantInv.Core.ViewModels;
using MahantInv.SharedKernel.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MahantInv.Core.Interfaces
{
    public interface IProductsRepository: IAsyncRepository<Product>
    {
        Task<IEnumerable<ProductVM>> GetProducts();
        Task<ProductVM> GetProductById(int productId);
        Task<bool> IsProductExist(string unitTypeCode);
    }
}
