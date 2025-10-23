# Use AWS Lambda Python 3.11 base image
FROM public.ecr.aws/lambda/python:3.11

# Install zip utility
RUN yum install -y zip && yum clean all

# Upgrade pip
RUN pip install --upgrade pip

# Set working directory inside container
WORKDIR /layer

# Copy your requirements.txt
COPY requirements.txt .

# Install all dependencies into python/ folder (Lambda layer structure)
RUN pip install -r requirements.txt -t python
RUN pip install pydantic --only-binary=:all: -t python

# Zip the python/ folder to create the Lambda layer
RUN zip -r layer.zip python

# Default entrypoint (optional)
ENTRYPOINT ["/bin/bash", "-l"]
