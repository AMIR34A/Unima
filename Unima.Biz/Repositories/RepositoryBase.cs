using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;
using Unima.Biz.RepositoriesInterface;

namespace Unima.Biz.Repositories;

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

    public async Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate) => await _dbSet.FirstOrDefaultAsync(predicate);

    public async Task<List<TEntity>> GetAllAsync() => await _dbSet.ToListAsync();

    public async Task<List<TEntity>> GetAllAsync(string navigateProperty) => await _dbSet.Include(navigateProperty).ToListAsync();

    public IIncludableQueryable<TEntity, TProperty> Include<TProperty>(Expression<Func<TEntity, TProperty>> navigateProperty)
    {
        return _dbSet.Include(navigateProperty);
    }

    public void Update(TEntity entity)
    {
        _dbSet.Update(entity);
    }

    public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate) => await _dbSet.AnyAsync(predicate);
}