FROM datamachines/nist-ace:demo
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt-get update && apt-get install -y nodejs netbase
WORKDIR /ace-ui
ADD . /ace-ui
WORKDIR /ace-ui/web-app
RUN npm install && npm run build
WORKDIR /ace-ui
RUN pip3 install -r requirements.txt
# Uncomment to run tests automatically.
#RUN flake8 --max-line-length=200 ./ace_db.py
#RUN flake8 --max-line-length=200 ./run.py
#RUN pytest ./test
EXPOSE 9095
CMD ["python3", "run.py"]
