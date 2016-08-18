using ChoreApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ChoreApp.Controllers
{
    public class ThisWeekController : ApiController
    {
        private ChoreRepository Repo;

        public ThisWeekController(ChoreRepository repo)
        {
            Repo = repo;
        }

        // GET api/<controller>
        public List<AssignmentSummary> Get(int id)
        {
            return Repo.GetChildAssignmentsThisWeek(id);
        }
    }
}