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
    public class ThisWeekController
    {
        private ChoreRepository Repo;

        public ThisWeekController(ChoreRepository repo)
        {
            Repo = repo;
        }

        // GET api/<controller>
        [HttpGet("{id}")]
        public List<AssignmentSummary> Get(int id)
        {
            return Repo.GetChildAssignmentsThisWeek(id);
        }
    }
}