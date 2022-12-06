FROM python:3.9-alpine

RUN apk add git gnupg gcc musl-dev linux-headers
COPY requirements.txt .
RUN pip3 install -r requirements.txt
RUN pip3 install git+https://github.com/ProtonMail/proton-python-client.git
