namespace Unima.Biz.RepositoriesInterface;

public interface IRepositoryBase<TEntity>
{
    Task<List<TEntity>> GetAllAsync();
    Task AddAsync(TEntity entity);
    void Update(TEntity entity);
    void Delete(TEntity entity);
}
