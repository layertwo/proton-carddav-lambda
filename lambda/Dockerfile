FROM public.ecr.aws/lambda/python:3.9

RUN yum install git gnupg gcc linux-headers -y
# COPY app/* ${LAMBDA_TASK_ROOT}
COPY requirements.txt .
RUN pip3 install -r requirements.txt
RUN pip3 install git+https://github.com/ProtonMail/proton-python-client.git

# TODO
# ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
# CMD [ "app.handler" ]
