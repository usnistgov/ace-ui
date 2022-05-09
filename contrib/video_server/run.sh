#!/bin/bash
# Run server

# Build container
docker build -t vserve .

<<<<<<< HEAD
#docker run -p 5010:5010 -t vserve  -p 5010 --fps 5 --shape 320 320
docker run -p 5010:5010 -t vserve  -p 5010 
=======
#docker run --network host -p 5010:5010 -t vserve 
docker run -p 5010:5010 -t vserve  -p 5010 --fps 5
>>>>>>> 2123f9b3242f731a337623328e3216efe887bf27
