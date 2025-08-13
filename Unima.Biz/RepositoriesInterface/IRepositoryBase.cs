using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Unima.Biz.RepositoriesInterface;

public interface IRepositoryBase<TEntity>
{
    Task<List<TEntity>> GetAllAsync();

    Task<List<TEntity>> GetAllAsync(string navigateProperty);

    IIncludableQueryable<TEntity, TProperty> Include<TProperty>(Expression<Func<TEntity, TProperty>> navigateProperty);

    Task AddAsync(TEntity entity);

    void Update(TEntity entity);

    void Delete(TEntity entity);

    Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate);
}