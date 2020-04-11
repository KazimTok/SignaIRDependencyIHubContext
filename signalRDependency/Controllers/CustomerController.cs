using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace signalRDependency.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IHubAnimeDispatcher _dispatcher;
        private CustomerDataContext _context;

        public CustomerController(IHubAnimeDispatcher dispatcher, CustomerDataContext context)
        {
            _dispatcher = dispatcher;
            _context = context;
        }


        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new List<string> { "test", "sdfdsf", "sdfsd" };
        }



        // GET api/values/5     
        [HttpGet("{moveType}/{connectionId}")]
        public async Task<ActionResult> Get(MoveType moveType, string connectionId ="")
        {
            await this._dispatcher.Move(moveType, connectionId);
            this._context.MoveLog.Add(new MoveLog() { ConnectionId = connectionId, Direction = (int)moveType, CreatedDateTime = DateTime.Now });
            this._context.SaveChanges();
            return Ok();
        }
    }
}