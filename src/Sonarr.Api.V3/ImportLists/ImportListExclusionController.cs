using System;
using System.Collections.Generic;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.ImportLists.Exclusions;
using Sonarr.Http;
using Sonarr.Http.Extensions;
using Sonarr.Http.REST;
using Sonarr.Http.REST.Attributes;

namespace Sonarr.Api.V3.ImportLists
{
    [V3ApiController]
    public class ImportListExclusionController : RestController<ImportListExclusionResource>
    {
        private readonly IImportListExclusionService _importListExclusionService;

        public ImportListExclusionController(IImportListExclusionService importListExclusionService,
                                             ImportListExclusionExistsValidator importListExclusionExistsValidator)
        {
            _importListExclusionService = importListExclusionService;

            SharedValidator.RuleFor(c => c.TvdbId).Cascade(CascadeMode.Stop)
                .NotEmpty()
                .SetValidator(importListExclusionExistsValidator);

            SharedValidator.RuleFor(c => c.Title).NotEmpty();
        }

        protected override ImportListExclusionResource GetResourceById(int id)
        {
            return _importListExclusionService.Get(id).ToResource();
        }

        [HttpGet]
        [Produces("application/json")]
        [Obsolete("Deprecated")]
        public List<ImportListExclusionResource> GetImportListExclusions()
        {
            return _importListExclusionService.All().ToResource();
        }

        [HttpGet("paged")]
        [Produces("application/json")]
        public PagingResource<ImportListExclusionResource> GetImportListExclusionsPaged([FromQuery] PagingRequestResource paging)
        {
            var pagingResource = new PagingResource<ImportListExclusionResource>(paging);
            var pageSpec = pagingResource.MapToPagingSpec<ImportListExclusionResource, ImportListExclusion>(
                new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                {
                    "id",
                    "title",
                    "tvdbId"
                },
                "id",
                SortDirection.Descending);

            return pageSpec.ApplyToPage(_importListExclusionService.Paged, ImportListExclusionResourceMapper.ToResource);
        }

        [RestPostById]
        [Consumes("application/json")]
        public ActionResult<ImportListExclusionResource> AddImportListExclusion([FromBody] ImportListExclusionResource resource)
        {
            var importListExclusion = _importListExclusionService.Add(resource.ToModel());

            return Created(importListExclusion.Id);
        }

        [RestPutById]
        [Consumes("application/json")]
        public ActionResult<ImportListExclusionResource> UpdateImportListExclusion([FromBody] ImportListExclusionResource resource)
        {
            _importListExclusionService.Update(resource.ToModel());
            return Accepted(resource.Id);
        }

        [RestDeleteById]
        public void DeleteImportListExclusion(int id)
        {
            _importListExclusionService.Delete(id);
        }

        // Shared validation rejects the whole batch as soon as one series is already excluded,
        // so it is skipped here and each item is validated individually instead.
        [HttpPost("bulk")]
        [SkipValidation(true, true)]
        [Consumes("application/json")]
        [Produces("application/json")]
        public object AddImportListExclusions([FromBody] List<ImportListExclusionResource> resources)
        {
            var added = new List<ImportListExclusionResource>();

            foreach (var resource in resources)
            {
                if (resource.TvdbId <= 0 || resource.Title.IsNullOrWhiteSpace())
                {
                    continue;
                }

                // Skip anything already excluded rather than failing the whole batch.
                if (_importListExclusionService.FindByTvdbId(resource.TvdbId) != null)
                {
                    continue;
                }

                added.Add(_importListExclusionService.Add(resource.ToModel()).ToResource());
            }

            return added;
        }

        [HttpDelete("bulk")]
        [Produces("application/json")]
        public object DeleteImportListExclusions([FromBody] ImportListExclusionBulkResource resource)
        {
            _importListExclusionService.Delete(resource.Ids.ToList());

            return new { };
        }
    }
}
