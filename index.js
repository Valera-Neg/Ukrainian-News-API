const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "guardian",
    address: "https://www.theguardian.com/world/ukraine",
    base: "",
  },

  {
    name: "vancouversun",
    address: "https://vancouversun.com/world/ukraine",
    base: "",
  },
  {
    name: "ctvnews",
    address: "https://www.ctvnews.ca/world/ukraine",
    base: "",
  },
  {
    name: "nyp",
    address: "https://nypost.com/tag/ukraine/",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/news/world-60525350",
    base: "https://www.bbc.com",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/search?text=ukraine",
    base: "https://www.smh.com.au",
  },
  {
    name: "latimes",
    address: "https://www.latimes.com/search?q=ukraine",
    base: "",
  },
  {
    name: "time",
    address: "https://time.com/search/?q=ucraine",
    base: "",
  },
  {
    name: "cityam",
    address: "https://www.cityam.com/?s=ukraine",
    base: "",
  },
  {
    name: "dailymail",
    address:
      "https://www.dailymail.co.uk/news/russia-ukraine-conflict/index.html",
    base: "",
  },
  {
    name: "globalnews",
    address: "https://globalnews.ca/?s=ukraine",
    base: "",
  },
  {
    name: "ottawacitizen",
    address: "https://ottawacitizen.com/search/?search_text=ukraine",
    base: "",
  },
  {
    name: "nbcnews",
    address: "https://www.nbcnews.com/world/russia-ukraine-news",
    base: "",
  },
];

const articles = [];

newspapers.forEach(newspaper => {
  axios.get(newspaper.address).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("a:contains('Ukraine')", html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my Ukrainian News API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    newspaper => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    newspaper => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("Ukraine")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on ${PORT}`));
