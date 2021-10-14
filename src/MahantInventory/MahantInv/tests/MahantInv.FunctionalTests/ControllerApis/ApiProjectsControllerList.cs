using Ardalis.HttpClientTestExtensions;
using MahantInv.Web;
using MahantInv.Web.ApiModels;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace MahantInv.FunctionalTests.ControllerApis
{
    [Collection("Sequential")]
    public class ProjectCreate : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public ProjectCreate(CustomWebApplicationFactory<Startup> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task ReturnsOneProject()
        {
            var result = await _client.GetAndDeserialize<IEnumerable<ProjectDTO>>("/api/projects");

            Assert.Equal(1, result.Count());
            Assert.Contains(result, i => i.Name == SeedData.TestProject1.Name);
        }
    }
}
