using ChoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ChoreApp.Controllers
{
    [Route("api/[controller]")]
    public class ChoresController
    {
        private ChoreRepository Repo;

        public ChoresController(ChoreRepository repo)
        {
            Repo = repo;
        }

        // GET api/users
        [HttpGet()]
        public List<Chore> Get()
        {
            return Repo.GetAllChores();
        }

        [HttpPost()]
        // POST api/<controller>
        public void Post([FromBody]Chore value)
        {
            Repo.AddChore(value);
        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]Chore value)
        {
            Repo.EditChore(id, value);
        }

        [HttpDelete("{id}")]
        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            Repo.DeleteChore(id);
        }

        [Route("complete")]
        [HttpPost]
        public void Complete([FromForm]CompleteChorePayload value)
        {
            Repo.CompleteChore(value);
        }

        [Route("clear")]
        [HttpPost]
        public void Clear([FromForm]CompleteChorePayload value)
        {
            Repo.ClearChoreCompletion(value);
        }
    }
}
