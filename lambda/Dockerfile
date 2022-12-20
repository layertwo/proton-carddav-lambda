FROM public.ecr.aws/lambda/python:3.9

ENV LAMBDA_TASK_ROOT=/var/task
ENV LAMBDA_RUNTIME_DIR=/var/runtime

RUN yum install git gnupg gcc linux-headers -y
COPY requirements.txt .
RUN pip3 install -r requirements.txt
RUN pip3 install git+https://github.com/ProtonMail/proton-python-client.git

COPY app ${LAMBDA_TASK_ROOT}/app

CMD [ "app.handler" ]
