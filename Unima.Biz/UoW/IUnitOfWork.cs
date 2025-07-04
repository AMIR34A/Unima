using Unima.Biz.RepositoriesInterface;

namespace Unima.Biz.UoW;

public interface IUnitOfWork
{
    IRepositoryBase<TEntity> RepositoryBase<TEntity>() where TEntity : class;

    Task<bool> SaveAsync();
}