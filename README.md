# 🗺️LoMap_en2a🗺️

LoMap is the perfect way to explore🔍 and share the world around you with your 🎅👮friends🤴🐒! With its up-to-date mapping and pods from the [Solid Project](https://solidproject.org/)<img src="https://solidproject.org/assets/img/solid-emblem.svg" height="20"> for decentralized data🔑, LoMap makes it easy to customize your map by adding and sharing places of interest🎢. Discover new locations and experiences with LoMap, and never worry about data privacy—because with pods, you are in 🔫control🔫.


1. 🔭[ LoMap ](#lomap)
2. 🏁[ Quick start guide ](#guide)
3. ☝️[ More information ](#more)
4. 😶‍🌫️[ About us ](#team)


[![Actions Status](https://github.com/arquisoft/lomap_en2a/workflows/CI%20for%20LOMAP_EN2A/badge.svg)](https://github.com/arquisoft/lomap_en2a/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_lomap_en2a&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_lomap_en2a)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_lomap_en2a&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_lomap_en2a)


<a name="lomap"></a>
## 🔭LoMap
With the initiative of the Council of Brussels and the collaboration of the <b>Solid community</b>, we are eager to present you THE maps software system: LoMap.  
This application allows our users to have personalized maps about places and local businesses in a city, wherever they may be. All the users personal data will be stored in their personal pods, that could be provided by <b>Inrupt</b>, <b>Solid</b> or any other pod supplier. In addition to this, users can have the chance to share their map and information with their friends. Also, if you are a competitive person, you are safe with us :), just try to be better than everyone else achieveng challenges and reach the Master rank!

To start using LoMap, just follow the steps below and 🔮 may the map be with you 🔮


<a name="guide"></a>
## 🏁Quick start guide

<p float="left">
<img src="https://blog.wildix.com/wp-content/uploads/2020/06/react-logo.jpg" height="100">
<img src="https://miro.medium.com/max/1200/0*RbmfNyhuBb8G3LWh.png" height="100">
<img src="https://miro.medium.com/max/365/1*Jr3NFSKTfQWRUyjblBSKeg.png" height="100">
</p>


This project is a basic example of website using **React** with **Typescript** and an endpoint using **NodeJS** with **express**.

<mark>In case you already have node.js and npm, make sure you update them before attempting to build the images</mark>

If you want to execute the project you will need [git](https://git-scm.com/downloads), [Node.js and npm](https://www.npmjs.com/get-npm) and [Docker](https://docs.docker.com/get-docker/). Make sure the three of them are installed in your system. Download the project with `git clone https://github.com/arquisoft/lomap_en2a`. The fastest way to launch everything is with docker:
```bash
docker-compose up --build
```
This will create two docker images as they don't exist in your system (the webapp and the restapi) and launch a mongo container database. It will also launch Prometheus and Grafana containers to monitor the webservice. You should be able to access everything from here:
 - [Webapp - http://localhost:3000](http://localhost:3000)
 - [Prometheus server - http://localhost:9090](http://localhost:9090)
 - [Grafana server http://localhost:9091](http://localhost:9091)
 
If you want to run it without docker. Compile and run the webapp:

```shell
cd webapp
npm install
npm start
```

You should be able to access the application in [http://localhost:3000](http://localhost:3000).

<a name="more"></a>
## ☝️More information
You can get more information about the repository in the other README files:
- Documentation: https://github.com/arquisoft/lomap_en2a/tree/master/docs
- Webapp: https://github.com/arquisoft/lomap_en2a/tree/master/webapp

<a name="team"></a>
# 😶‍🌫️TEAM MEMBERS (COLLABORATORS)

🤓☝️ Adrián Vega Sánchez UO282365@uniovi.es<br>
🤯💸 Patricia Garcia Fernández uo282210@uniovi.es <br>
🦍🦧 Pablo Argallero Fernández uo283216@uniovi.es <br>
🗿🍪 Santiago Fernández Carballal uo283523@uniovi.es




