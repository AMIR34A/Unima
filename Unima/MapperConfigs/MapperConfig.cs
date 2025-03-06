using AutoMapper;
using Unima.Dal.Entities;
using Unima.Dal.Enums;
using Unima.Models.Account;

namespace Unima.MapperConfigs;

public class MapperConfig
{
    public static TDestination Map<TSource, TDestination>(TSource source)
    {
        var configuration = new MapperConfiguration(configure =>
        {
            configure.CreateMap(typeof(TSource), typeof(TDestination));
        });

        return new Mapper(configuration).Map<TSource, TDestination>(source);
    }

    public static ApplicationUser ApplicationUserMap(UserRegisterModel source)
    {
        var configuration = new MapperConfiguration(configure =>
        {
            configure.CreateMap<UserRegisterModel, ApplicationUser>().ForMember("RegisterDate", option =>
            {
                option.MapFrom(src => DateTime.Now);
            });

            if (source.PhoneNumber.StartsWith("0"))
                source.PhoneNumber = source.PhoneNumber.Remove(0, 1);
        });

        return new Mapper(configuration).Map<UserRegisterModel, ApplicationUser>(source);
    }
}
