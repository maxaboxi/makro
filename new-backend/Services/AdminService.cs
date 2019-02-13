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
            return await _context.Users.ToListAsync();
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
            return await _context.EditedFoods.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Article>>> GetAllAritcles()
        {
            return await _context.Articles.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Answer>>> GetAllEAnswers()
        {
            return await _context.Answers.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Question>>> GetAllQuestions()
        {
            return await _context.Questions.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Comment>>> GetAllComments()
        {
            return await _context.Comments.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Like>>> GetAllLikes()
        {
            return await _context.Likes.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<Day>>> GetAllDays()
        {
            return await _context.Days.ToListAsync();
        }

        public async Task<ActionResult<IEnumerable<SharedDay>>> GetAllSharedDays()
        {
            return await _context.SharedDays.ToListAsync();
        }

    }
}
