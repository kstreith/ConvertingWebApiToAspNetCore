using ChoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChoreApp.Controllers
{
    public class ChoresController : ApiController
    {
        private ChoreRepository Repo;

        public ChoresController(ChoreRepository repo)
        {
            Repo = repo;
        }

        // GET api/users
        public List<Chore> Get()
        {
            return Repo.GetAllChores();
        }

        // POST api/<controller>
        public void Post(Chore value)
        {
            Repo.AddChore(value);
        }

        // PUT api/<controller>/5
        public void Put(int id, Chore value)
        {
            Repo.EditChore(id, value);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            Repo.DeleteChore(id);
        }

        [Route("api/chores/complete")]
        [HttpPost]
        public void Complete([FromForm] CompleteChorePayload value)
        {
            Repo.CompleteChore(value);
        }

        [Route("api/chores/clear")]
        [HttpPost]
        public void Clear([FromForm] CompleteChorePayload value)
        {
            Repo.ClearChoreCompletion(value);
        }
    }
}
