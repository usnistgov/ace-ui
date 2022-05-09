#!/bin/bash
# Run server

# Build container
docker build -t vserve .

#docker run -p 5010:5010 -t vserve  -p 5010 --fps 5 --shape 320 320
docker run -p 5010:5010 -t vserve  -p 5010 
