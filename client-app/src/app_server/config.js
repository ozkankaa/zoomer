const env = process.env.NODE_ENV || "production";

const config = {
  development: {
    APIBaseUrl: "https://api.zoom.us/v2/",
    APIKey: "",
    APISecret: "",
  },
  production: {
    APIBaseUrl: "https://api.zoom.us/v2/",
    APIKey: "",
    APISecret: "",
  },
};

module.exports = config[env];
