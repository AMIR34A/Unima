using Microsoft.EntityFrameworkCore;
using Unima.Biz.RepositoriesInterface;

namespace Unima.Biz.Repositories
{
    public class RepositoryBase<TEntity, TContext> : IRepositoryBase<TEntity> where TEntity : class where TContext : DbContext
    {
        private TContext _context;
        private DbSet<TEntity> _dbSet;
        public RepositoryBase(TContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }

        public async Task AddAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Delete(TEntity entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            List<TEntity> entities = await _dbSet.ToListAsync();
            return entities;
        }

        public void Update(TEntity entity)
        {
            _dbSet.Update(entity);
        }
    }
}
