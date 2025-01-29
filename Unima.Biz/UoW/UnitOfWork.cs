using Unima.Biz.Repositories;
using Unima.Biz.RepositoriesInterface;
using Unima.Dal.Context;

namespace Unima.Biz.UoW;

public class UnitOfWork : IUnitOfWork
{
    private UnimaDbContext _unimaDbContext { get; }

    public UnitOfWork(UnimaDbContext unimaDbContext)
    {
        _unimaDbContext = unimaDbContext;
    }

    public IRepositoryBase<TEntity> RepositoryBase<TEntity>() where TEntity : class
    {
        return new RepositoryBase<TEntity, UnimaDbContext>(_unimaDbContext);
    }

    public async Task SaveAsync() => await _unimaDbContext.SaveChangesAsync();
}
