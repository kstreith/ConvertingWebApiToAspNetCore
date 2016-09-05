using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChoreApp.Models
{
    public class CompletedChore
    {
        public CompletedChore(int id, int choreId, int childId, DateTime date)
        {
            Id = id;
            ChoreId = choreId;
            ChildId = childId;
            Date = date;
        }
        public int Id { get; private set; }
        public int ChoreId { get; private set; }
        public int ChildId { get; private set; }
        public DateTime? Date { get; private set; }
    }
}