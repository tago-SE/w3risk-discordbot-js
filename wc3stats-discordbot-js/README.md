# How to setup your own discord.js project

Checkout https://github.com/nomsi/docker-discordjs-tutorial for a full guide on how to setup, create and dockerize your very own discord-bot.

Below are commands used to dockerize the bot

    docker build -t wc3stats-bot .
    docker run -d wc3stats-bot

    # Get the container!
    docker ps
    # Print the logs
    docker logs <container ID>

That will give us our information and current running logs.
If you need to get inside the container (and it's tempting, I know) you can run:

    docker exec -it <container id> /bin/bash

Log into the Docker Hub from the command line

    docker login --help'.
    docker login --userswname yourhubusername --password yourpassword

tag your image

    docker images
    docker tag <image-id> yourhubusername/yourrepository:latest


Pushing the image to the dockerhub with the tag 'latest':

    docker push yourhubusername/yourrepository:latest

public https://hub.docker.com/r/pudg0/wc3stats-js

private: https://cloud.docker.com/u/pudg0/repository/docker/pudg0/wc3stats-js

# Hosting a discord-bot on Azure VM

https://angelalukic.wixsite.com/blog/single-post/Discord-Bot-through-Microsoft-Azure-Virtual-Machines