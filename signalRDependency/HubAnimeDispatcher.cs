using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace signalRDependency
{
    public interface IHubAnimeDispatcher
    {
        Task Move(MoveType moveType, string connectionId);
    }

   
    public class HubAnimeDispatcher : IHubAnimeDispatcher
    {
        private readonly IHubContext<Animehub> _hubContext;
        public HubAnimeDispatcher(IHubContext<Animehub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task Move(MoveType moveType, string connectionId)
        {
            await this._hubContext.Clients.All.SendAsync("MoveBlock", moveType, connectionId);
        }
    }

    public enum MoveType
    {
        Up = 38,
        Down = 40,
        Right = 39,
        Left = 37
    }
}
