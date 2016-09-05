﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChoreApp.Models
{
    public class AssignmentSummary
    {
        public AssignmentSummary(int choreId, int childId, string description, DayOfWeek day, bool completed)
        {
            ChoreId = choreId;
            ChildId = childId;
            Description = description;
            Day = day;
            Completed = completed;
        }
        public AssignmentSummary Clone()
        {
            return (AssignmentSummary)this.MemberwiseClone();
        }
        public int ChoreId { get; private set;  }
        public int ChildId { get; private set; }
        public String Description { get; private set; }
        public String DayFormatted
        {
            get
            {
                return Day.ToString();
            }
        }
        public DayOfWeek Day { get; private set; }
        public bool Completed { get; private set; }
        public bool Overdue
        {
            get
            {
                var todayDay = DateTime.Now.DayOfWeek;
                //var todayDay = DayOfWeek.Friday;
                return !Completed && todayDay > Day;
            }
        }
    }
}