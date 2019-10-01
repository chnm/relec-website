# American Religious Ecologies

This repository contains the website for the [*American Religious Ecologies*](http://religiousecologies.org) project at the [Roy Rosenzweig Center for History and New Media](https://rrchnm.org).

## Installing

The website is built using Hugo, a static site generator. Follow the [installation instructions](https://gohugo.io/getting-started/installing/) for your platform.

If you need to build the CSS for the site from the SASS source, you will need the development dependencies. Assuming you have Node and npm installed, run `npm install` to get those dependencies, then `npm run-script build`.

## Previewing 

The `Makefile` contains rules for previewing, building, and deploying the site.

To preview the site locally, including draft and future content, run `make preview`. 
