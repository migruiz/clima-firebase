FROM resin/raspberrypi3-debian
RUN [ "cross-build-start" ]

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
&& apt-get install -yqq --no-install-recommends nodejs   && rm -rf /var/lib/apt/lists/*

RUN apt-get update && \
apt-get install -yqq --no-install-recommends g++ gcc make && rm -rf /var/lib/apt/lists/*



RUN mkdir /ClimaFirebase/
COPY App/package.json  /ClimaFirebase/package.json

RUN cd /ClimaFirebase \
&& npm  install 


COPY App /ClimaFirebase



RUN [ "cross-build-end" ]  



ENTRYPOINT ["node","/ClimaFirebase/app.js"]