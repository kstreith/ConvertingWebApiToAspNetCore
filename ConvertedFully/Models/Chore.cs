using System;
using System.Collections.Generic;

namespace ChoreApp.Models
{
    public class Chore
    {
        public Chore(int id, int childId, string description, bool onSunday = false, bool onMonday = false, bool onTuesday = false, bool onWednesday = false, bool onThursday = false, bool onFriday = false, bool onSaturday = false)
        {
            Id = id;
            ChildId = childId;
            Description = description;
            OnSunday = onSunday;
            OnMonday = onMonday;
            OnTuesday = onTuesday;
            OnWednesday = onWednesday;
            OnThursday = onThursday;
            OnFriday = onFriday;
            OnSaturday = onSaturday;
        }
        public int Id { get; private set; }
        public String ChildName { get; private set; }
        public int ChildId { get; private set; }
        public String Description { get; private set; }
        public String AssignedDaysFormatted
        {
            get
            {
                var dayAbbrevs = new List<String>();
                if (OnSunday)
                {
                    dayAbbrevs.Add("Su");
                }
                if (OnMonday)
                {
                    dayAbbrevs.Add("M");
                }
                if (OnTuesday)
                {
                    dayAbbrevs.Add("T");
                }
                if (OnWednesday)
                {
                    dayAbbrevs.Add("W");
                }
                if (OnThursday)
                {
                    dayAbbrevs.Add("Th");
                }
                if (OnFriday)
                {
                    dayAbbrevs.Add("F");
                }
                if (OnSaturday)
                {
                    dayAbbrevs.Add("Sa");
                }
                return String.Join(" ", dayAbbrevs);
            }
        }
        public bool OnSunday { get; private set; }
        public bool OnMonday { get; private set; }
        public bool OnTuesday { get; private set; }
        public bool OnWednesday { get; private set; }
        public bool OnThursday { get; private set; }
        public bool OnFriday { get; private set; }
        public bool OnSaturday { get; private set; }
        public Chore Clone()
        {
            return (Chore)this.MemberwiseClone();
        }
        public Chore SetUser(User user)
        {
            var c = this.Clone();
            c.ChildId = user.Id;
            c.ChildName = user.Name;
            return c;
        }

    }
}