using AutoMapper;
using MahantInv.Web.ViewModels;

namespace MahantInv.Web.Utility
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            //CreateMap<destination, source>();
            CreateMap<ProductVM, dynamic>();
        }
    }
}
