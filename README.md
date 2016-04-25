Ftv::Components::Timebar
========================

Angular Timebar component usually used for video player to quickly going on different time by clicking or dragging.

# Get sources

```
git clone git@gitlab.ftven.net:team-infini/ftv-angular-timebar.git
```

# Required dependencies

- [npm](https://nodejs.org/)
- [gem](https://rubygems.org/)

# Installation process

```
sudo apt-get install ruby ruby-dev gem
npm install -g gulp

npm install
gem update --system
gem install compass

gulp build
```

# Development build for front web only

```
gulp build-dev-watch
```

## Tests

```
gulp build
bower install
gulp karma-test
```

## Demo

```
gulp build
npm install -g http-server
http-server
```

Open [demo](http://127.0.0.1:8080/demo.html)
