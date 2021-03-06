﻿using Makro.DB;
using Makro.DTO;
using Makro.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Makro.Services
{
    public class StatisticsService
    {
        private readonly MakroContext _context;
        public StatisticsService(MakroContext context)
        {
            _context = context;
        }

        public async Task<StatsDto> GetStats()
        {
            return new StatsDto
            {
                Users = await _context.Users.CountAsync(),
                UserLoggedInTheLastSevenDays = await _context.Users.Where(u => u.LastLogin >= DateTime.Now.AddDays(-7)).CountAsync(),
                Foods = await _context.Foods.CountAsync(),
                Days = await _context.Days.Where(d => d.IsLatest == true).CountAsync(),
                PDF = await _context.UserPDFs.CountAsync(),
                MaleCount = await _context.Users.Where(u => u.Sex == "mies").CountAsync(),
                FemaleCount = await _context.Users.Where(u => u.Sex == "nainen").CountAsync(),
                AverageAge = await _context.Users.Where(u => u.Age > 0).Select(u => u.Age).AverageAsync(),
                AverageHeight = await _context.Users.Where(u => u.Height > 0).Select(u => u.Height).AverageAsync(),
                AverageWeight = await _context.Users.Where(u => u.Weight > 0).Select(u => u.Weight).AverageAsync(),
                TopFoods = await GetFoodOccurences()
            };
        }

        public async Task<ActionResult<ResultDto>> PdfCreated(UserPdfDto userPdfDto)
        {
            var user = await _context.Users.Where(u => u.UUID == userPdfDto.User).FirstOrDefaultAsync();
            
            await _context.UserPDFs.AddAsync(
                new UserPDF {
                    UUID = Guid.NewGuid().ToString(),
                    User = user,
                    Day = userPdfDto.Day != null ? await _context.Days.Where(d => d.UUID == userPdfDto.Day).FirstOrDefaultAsync() : null,
                    CreatedAt = DateTime.Now
                }
            );

            await _context.SaveChangesAsync();

            return new ResultDto(true, "Stats updated");
        }

        public async Task<AmountDto> GetAmoutOfPDFsCreatedByUser(string userId)
        {
            return new AmountDto(await _context.UserPDFs.Where(u => u.User.UUID == userId).CountAsync());
        }

        private async Task<List<TopFoodsDto>> GetFoodOccurences()
        {
            var foods = _context.MealFoods.Select(mf => mf.FoodId)
                .AsEnumerable()
                .GroupBy(mf => mf)
                .OrderByDescending(f => f.Count())
                .Take(10);

            var foodIds = new List<int>();

            foreach (var f in foods)
            {
                foodIds.Add(f.Key);
            }

            var foodNames = await _context.Foods.Where(f => foodIds.Contains(f.Id))
                .Select(f => new { f.Id, f.Name })
                .ToListAsync();

            var combined = new List<TopFoodsDto>();

            foreach (var f in foodNames)
            {
                combined.Add(new TopFoodsDto {
                    Name = f.Name,
                    Count = foods.Where(tf => tf.Key == f.Id).Select(tf => tf.Count()).FirstOrDefault()
                });
            }

            combined.Sort((n, c) => c.Count.CompareTo(n.Count));

            return combined;
        }
    }
}
