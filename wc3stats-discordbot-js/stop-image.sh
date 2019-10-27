#!/bin/bash

# Name of docker image
imagename=${1?Error: no name given}

echo "Attempting to stop image '$imagename'..."

docker stop $(docker ps | awk '{split($2,image,":"); print $1, image[1]}' | awk -v image=$imagename '$2 == image {print $1}')
