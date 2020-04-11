using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace signalRDependency
{
    public class Animehub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await  Clients.Caller.SendAsync("GetConnectionId", this.Context.ConnectionId);
        }
    }
}
