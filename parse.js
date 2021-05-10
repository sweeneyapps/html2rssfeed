const Feed = require('feed').Feed;
const parse = require('node-html-parser').parse
const fs = require('fs')


const baseUrl = "http://localhost:3000" // process.env.BASE_URL;
const date = new Date()

const author = {
  name: 'Paul Sweeney',
  email: 'paul@sweeneyapps.com',
  link: 'https://twitter.com/vphreak'
}

const feed = new Feed({
  title: `Paul's blog`,
  description: 'Welcome to my blog!',
  id: baseUrl,
  link: baseUrl,
  language: 'en',
  copyright: `All rights reserved ${date.getFullYear()}, Paul`,
  updated: date,
  generator: 'Next.js using Feed for Node.js',
  feedLinks: {
    rss2: `${baseUrl}/rss/feed.xml`,
    json: `${baseUrl}/rss/feed.json`,
    atom: `${baseUrl}/rss/atom.xml`
  },
  author
})

function addItem({title, description, content, url, rawDate}) {
  feed.addItem({
    title,
    id: url,
    link: url,
    description,
    content,
    author: [author],
    contributor: [author],
    date: new Date(rawDate)
  })
}

addItem({
  title: "How to write a blog",
  description: 'you will learn how to write a blog cleanly',
  id: "1",
  link: "https://localhost:3000/howtowriteblog",
  rawDate: 'March 28, 2021',
  content: `<h1> I'm the content here </h1>`,
})


const htmlfiles = fs.readdirSync(`${process.cwd()}/`, "utf-8")

const listOfHtmlFiles = htmlfiles.filter(filename => filename.endsWith(".html"))

listOfHtmlFiles.forEach((filename) => {
  let htmlContent = fs.readFileSync(`${process.cwd()}/${filename}`, 'utf8');
  const root = parse(htmlContent);

  addItem({
    title: root.querySelector('#title').innerText,
    description: root.querySelector("#description").innerText,
    id: 'asdf',
    link: `${baseUrl}/${filename}`,
    rawDate: root.querySelector("#date").innerText,
    content: root.querySelector("article").innerHTML,
  })
})

fs.mkdirSync('./public/rss', { recursive: true });

fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
fs.writeFileSync('./public/rss/feed.json', feed.json1());

