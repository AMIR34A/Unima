using Unima.Biz.Repositories;
using Unima.Biz.RepositoriesInterface;
using Unima.Dal.Identity.Context;

namespace Unima.Biz.UoW;

public class UnitOfWork : IUnitOfWork
{
    private UnimaIdentityDbContext _unimaIdentityDbContext { get; }

    public UnitOfWork(UnimaIdentityDbContext unimaIdentityDbContext)
    {
        _unimaIdentityDbContext = unimaIdentityDbContext;
    }

    public IRepositoryBase<TEntity> RepositoryBase<TEntity>() where TEntity : class
    {
        return new RepositoryBase<TEntity, UnimaIdentityDbContext>(_unimaIdentityDbContext);
    }

    public async Task SaveAsync() => await _unimaIdentityDbContext.SaveChangesAsync();
}
