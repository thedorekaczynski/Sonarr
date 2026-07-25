using System.Collections.Generic;
using Newtonsoft.Json;

namespace NzbDrone.Core.MetadataSource.Tmdb.Resource
{
    public class TmdbSeriesListResponseResource
    {
        public TmdbSeriesListResponseResource()
        {
            Results = new List<TmdbSeriesResource>();
        }

        public int Page { get; set; }
        public List<TmdbSeriesResource> Results { get; set; }

        [JsonProperty("total_pages")]
        public int TotalPages { get; set; }

        [JsonProperty("total_results")]
        public int TotalResults { get; set; }
    }

    public class TmdbSeriesResource
    {
        public TmdbSeriesResource()
        {
            Genres = new List<TmdbGenreResource>();
            GenreIds = new List<int>();
            Networks = new List<TmdbNetworkResource>();
            OriginCountry = new List<string>();
            EpisodeRunTime = new List<int>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Overview { get; set; }
        public string Status { get; set; }
        public string Homepage { get; set; }

        [JsonProperty("original_name")]
        public string OriginalName { get; set; }

        [JsonProperty("original_language")]
        public string OriginalLanguage { get; set; }

        [JsonProperty("first_air_date")]
        public string FirstAirDate { get; set; }

        [JsonProperty("last_air_date")]
        public string LastAirDate { get; set; }

        [JsonProperty("poster_path")]
        public string PosterPath { get; set; }

        [JsonProperty("backdrop_path")]
        public string BackdropPath { get; set; }

        [JsonProperty("vote_average")]
        public decimal VoteAverage { get; set; }

        [JsonProperty("vote_count")]
        public int VoteCount { get; set; }

        public decimal Popularity { get; set; }

        [JsonProperty("genre_ids")]
        public List<int> GenreIds { get; set; }

        public List<TmdbGenreResource> Genres { get; set; }

        public List<TmdbNetworkResource> Networks { get; set; }

        [JsonProperty("origin_country")]
        public List<string> OriginCountry { get; set; }

        [JsonProperty("episode_run_time")]
        public List<int> EpisodeRunTime { get; set; }

        [JsonProperty("last_episode_to_air")]
        public TmdbEpisodeResource LastEpisodeToAir { get; set; }

        [JsonProperty("external_ids")]
        public TmdbExternalIdsResource ExternalIds { get; set; }

        [JsonProperty("content_ratings")]
        public TmdbContentRatingsResource ContentRatings { get; set; }
    }

    public class TmdbEpisodeResource
    {
        public int? Runtime { get; set; }
    }

    public class TmdbGenreResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class TmdbNetworkResource
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class TmdbExternalIdsResource
    {
        [JsonProperty("tvdb_id")]
        public int? TvdbId { get; set; }

        [JsonProperty("imdb_id")]
        public string ImdbId { get; set; }
    }

    public class TmdbContentRatingsResource
    {
        public TmdbContentRatingsResource()
        {
            Results = new List<TmdbContentRatingResource>();
        }

        public List<TmdbContentRatingResource> Results { get; set; }
    }

    public class TmdbContentRatingResource
    {
        [JsonProperty("iso_3166_1")]
        public string Country { get; set; }

        public string Rating { get; set; }
    }
}
