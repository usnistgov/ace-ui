This was build using a base react template from https://github.com/hanyuei/react-material-admin (MIT licensed)


## Installation / Running

_for dev_

```sh
git clone <repository-url>

# change into the new directory
npm install

npm start # will run the app

# Visit the app at http://localhost:3000
```

_for test_

```
npm run test
```

_for Production_

```sh
npm run build

cd build

# start a static server serving ./build dir, eg node serve/http-server or serve in express using express.static
serve -s build
```
