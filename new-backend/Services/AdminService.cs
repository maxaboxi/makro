using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Makro.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace Makro.Services
{
    public class AdminService
    {
        private readonly MakroContext _context;
        public AdminService(MakroContext context)
        {
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            return await _context.Users.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<User>> GetUserInformation(string id)
        {
            var user = await _context.Users.Include(u => u.Meals).Where(p => p.UUID == id).FirstOrDefaultAsync();

            if (user != null)
            {
                user.Password = null;
                user.Meals.Reverse(0, user.Meals.Count);
                return user;
            }

            return null;
        }

        public async Task<ActionResult<IEnumerable<EditedFood>>> GetAllEditedFoods()
        {
            return await _context.EditedFoods.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Article>>> GetAllAritcles()
        {
            return await _context.Articles.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Answer>>> GetAllEAnswers()
        {
            return await _context.Answers.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestions()
        {
            return await _context.Questions.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Comment>>> GetAllComments()
        {
            return await _context.Comments.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikes()
        {
            return await _context.Likes.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Day>>> GetAllDays()
        {
            return await _context.Days.AsNoTracking().ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<SharedDay>>> GetAllSharedDays()
        {
            return await _context.SharedDays.AsNoTracking().ToListAsync();
        }

    }
}
