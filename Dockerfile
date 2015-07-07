FROM centos:centos7
MAINTAINER Jimmi Dyson <jimmidyson@gmail.com>
ENTRYPOINT ["/kuisp"]

ENV OAUTH_PROVIDER openshift

ENV KUISP_VERSION 0.10

RUN yum install -y tar && \
    yum clean all && \
    curl -L https://github.com/jimmidyson/kuisp/releases/download/v${KUISP_VERSION}/kuisp-${KUISP_VERSION}-linux-amd64.tar.gz | \
      tar xzv

COPY site /site/
RUN chmod 777 /site/osconsole/ /site/apiman/

WORKDIR /site/
USER nobody

EXPOSE 9090

CMD [ "-p", "9090", \
      "-c", "/site/osconsole/config.${OAUTH_PROVIDER}.js.tmpl=/site/osconsole/config.js", \
      "--default-page=/index.html", \
      "--max-age=24h", \
      "--compress" ]
