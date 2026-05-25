const axios = require("axios");

class Logger {
  constructor() {
    this.apiKey = null;
    this.appName = null;
    this.baseURL = "http://localhost:4000";
  }

  init({ apiKey, appName }) {
    this.apiKey = apiKey;
    this.appName = appName;
  }

  async log({ message, level }) {
    try {
      const res = await axios.post(
        `${this.baseURL}/api/applications/${this.appName}/logs`,
        { message, level },
        {
          headers: {
            "x-api-key": this.apiKey,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  }
}

module.exports = new Logger();
