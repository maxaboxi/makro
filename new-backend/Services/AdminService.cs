using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Makro.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
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
    }
}
