using RestSharp;
using RestSharp.Serializers;
using System;
using ZoomerApi.Models;

namespace ZoomerApi.Client
{
    public class ZoomClient : IZoomClient
    {
        protected const string BASE_URL = "https://api.zoom.us/v2/";

        ZoomClientOptions Options { get; }
        RestClient WebClient { get; }

        public IZoomMeetingsClient Meetings { get; }

        public ZoomClient(ZoomClientOptions options)
        {
            if (options == null)
            {
                throw new Exception("No options provided for zoom client");
            }

            if (string.IsNullOrWhiteSpace(options.ZoomApiKey))
            {
                throw new Exception("No api key provided for zoom client");
            }

            if (string.IsNullOrWhiteSpace(options.ZoomApiSecret))
            {
                throw new Exception("No api secret provided for zoom client");
            }

            Options = options;
            if (string.IsNullOrWhiteSpace(Options.ZoomApiBaseUrl))
            {
                Options.ZoomApiBaseUrl = BASE_URL;
            }

            WebClient = new RestClient(options.ZoomApiBaseUrl);

            // Override with Newtonsoft JSON Handler
            WebClient.AddHandler("application/json", () => NewtonsoftJsonSerializer.Default);
            WebClient.AddHandler("text/json", () => NewtonsoftJsonSerializer.Default);
            WebClient.AddHandler("text/x-json", () => NewtonsoftJsonSerializer.Default);
            WebClient.AddHandler("text/javascript", () => NewtonsoftJsonSerializer.Default);
            WebClient.AddHandler("*+json", () => NewtonsoftJsonSerializer.Default);

            Meetings = new ZoomMeetingsClient(Options, WebClient);
        }
    }
}
