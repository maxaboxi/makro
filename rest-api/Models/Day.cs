using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;
using Newtonsoft.Json;
namespace Makro.Models
{
    public class Day
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string UUID { get; set; }
        [Required]
        public User User { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public ICollection<Meal> Meals { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? Date { get; set; }
        public ICollection<TrackedPeriodDay> TrackedPeriodDays { get; set; }
        public bool IsLatest { get; set; }
        public string LatestVersionId { get; set; }
        public bool HasVersions { get; set; }
        public DateTime? VersionCreated { get; set; }
    }
}
