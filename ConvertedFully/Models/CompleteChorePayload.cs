using System;
using System.Collections.Generic;
using System.Linq;

namespace ChoreApp.Models
{
    public class CompleteChorePayload
    {
        public int ChildId { get; set; }
        public int ChoreId { get; set; }
        public DayOfWeek Day { get; set; }
    }
}