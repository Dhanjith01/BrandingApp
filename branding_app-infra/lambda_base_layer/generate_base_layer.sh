docker rm layer-container
docker build -t base-layer .
docker run --name layer-container base-layer
docker cp layer-container:/layer/layer.zip . && echo "Created layer.zip with updated base layer."


#🧹 docker rm layer-container
#- Removes any existing container named layer-container.
#- Prevents name conflicts when you re-run the container.
#- Safe to run even if the container doesn't exist (Docker will warn but continue).
#
#🏗️ docker build -t base-layer
#- Builds a Docker image from your current directory's Dockerfile.
#- Tags the image as base-layer for easy reference.
#
#🚀 docker run --name layer-container base-layer
#- Runs a container from the base-layer image.
#- Names the container layer-container so you can reference it later.
#- This container generates layer.zip inside its filesystem.
#
#📦 docker cp layer-container:layer.zip .
#- Copies the layer.zip file from inside the container (layer-container) to your host machine's current directory (.).
#- This is how you extract the packaged Lambda layer from the container.
#
#✅ && echo "Created layer.zip with updated base layer."
#- If the docker cp succeeds, this prints a confirmation message.
#- Helps verify that the zip was successfully created and copied.
#
#🧠 Summary
#This sequence:
#- Cleans up any old container.
#- Builds your image.
#- Runs it to generate the Lambda layer.
#- Extracts the layer.zip to your local machine.
#Let me know if you want to automate this with a shell script or integrate it into a CDK deployment.
