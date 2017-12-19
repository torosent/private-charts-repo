# Private Helm Repo

This is an example of a private helm charts repository. The http server clones a private GitHub or BitBucket repo and serve the files. 

#### This http server is for internal usage should not be exposed with a public IP.

## How It Works


### Setup server

#### Local

```console

$ export GIT_REPO=
$ export GIT_USERNAME=
$ export GIT_PASSWORD= #token for GitHub or password for BitBucket
$ export GIT_TYPE= #github or bitbucket
$ npm install
$ node index.js

```

#### Docker

Build and run the container

```console

$ docker build -t ****/privatehelmrepo .
$ docker run -e GIT_REPO=**** -e GIT_USERNAME=**** -e GIT_PASSWORD=**** -e GIT_TYPE=**** ****/privatehelmrepo

```

#### Kubernetes

edit the `deployment.yaml`, `service.yaml` and `secret.yaml` files

```console

$ kubectl create -f secret.yaml
$ kubectl create -f deployment.yaml
$ kubectl create -f service.yaml

```

### Setup charts and client

Set up the server to point to the `charts` folder. From there, you can
create and publish charts like this:

```console
$ helm create mychart
$ helm package mychart
$ mv mychart-0.1.0.tgz charts
$ helm repo index charts --url http://some-internal-ip
$ git add -i
$ git commit -av
$ git push origin master
```

Now you can do a `helm repo add helmreponame http://some-internal-ip/charts`



