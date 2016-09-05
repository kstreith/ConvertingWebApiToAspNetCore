using ChoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChoreApp.Controllers
{
    public class UsersController : ApiController
    {
        private ChoreRepository Repo;

        public UsersController(ChoreRepository repo)
        {
            Repo = repo;
        }

        // GET api/users
        public List<User> Get()
        {
            return Repo.GetAllUsers();
        }

        // GET api/<controller>/5
        public User Get(int id)
        {
            return Repo.GetUser(id);
        }

        // POST api/<controller>
        public void Post(User value)
        {
            Repo.AddUser(value);
        }

        // PUT api/<controller>/5
        public void Put(int id, User value)
        {
            Repo.EditUser(id, value);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            Repo.DeleteUser(id);
        }

        [Route("api/test")]
        [HttpGet]
        public HttpResponseMessage Test()
        {
            var resp =  new HttpResponseMessage(HttpStatusCode.OK);
            resp.Content = new StringContent("Api Response");
            return resp;
        }
    }
}
