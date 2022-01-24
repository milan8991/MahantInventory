using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MahantInv.Web.Api
{
    public class HomeApiController : BaseApiController
    {
        public HomeApiController(IMapper mapper) : base(mapper)
        {
        }
    }
}
