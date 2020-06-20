# American Religious Ecologies

This repository contains the website for the [*American Religious Ecologies*](http://religiousecologies.org) project at the [Roy Rosenzweig Center for History and New Media](https://rrchnm.org).

## Installing

The website is built using Hugo, a static site generator. Follow the [installation instructions](https://gohugo.io/getting-started/installing/) for your platform. 

It also uses Node/npm for JavaScript dependencies. You will need to have those installed for your system.

Then run `npm install` in order to install the dependencies.

## Webpack and visualizations

Each visualization for the site gets its own directory in `viz/`. All assets related to a visualization should go in there, including CSS. There should be a single JavaScript entry point, usually named `main.js` for each visualization. Those entry points should be added to the `webpack.config.js` file. 

The visualizations will be compiled as a part of the build steps defined in the `Makefile`.

## Previewing 

The `Makefile` contains rules for previewing, building, and deploying the site.

To preview the site locally, including draft and future content, run `make preview`. 

To build for production, run `make build` and to deploy run `make deploy`.
