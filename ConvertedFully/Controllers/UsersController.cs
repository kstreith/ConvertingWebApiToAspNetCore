using System;
using System.Collections.Generic;
using ChoreApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChoreApp.Controllers
{
    [Route("api/[controller]")]
    public class UsersController
    {
        private ChoreRepository Repo;

        public UsersController(ChoreRepository repo)
        {
            Repo = repo;
        }

        // GET api/users
        [HttpGet()]
        public List<User> Get()
        {
            return Repo.GetAllUsers();
        }

        [HttpGet("{id}")]
        // GET api/<controller>/5
        public User Get(int id)
        {
            return Repo.GetUser(id);
        }

        [HttpPost()]
        // POST api/<controller>
        public void Post([FromBody]User value)
        {
            Repo.AddUser(value);
        }

        [HttpPut("{id}")]
        // PUT api/<controller>/5
        public void Put(int id, [FromBody]User value)
        {
            Repo.EditUser(id, value);
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Repo.DeleteUser(id);
        }

    }
}
