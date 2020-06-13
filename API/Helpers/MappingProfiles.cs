using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //d = destination, s = source
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(d => d.Productbrand, o => o.MapFrom(s => s.Productbrand.Name))
                .ForMember(d => d.ProductType, o => o.MapFrom(s => s.Productbrand.Name))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());
        }
    }
}