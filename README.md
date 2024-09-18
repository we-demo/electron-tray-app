# electron-tray-app

```sh
# only 'yarn' works
yarn

# Could not get code signature for running application #7476
# https://github.com/electron/electron/issues/7476#issuecomment-507953229
codesign --deep --force --verbose --sign - node_modules/electron/dist/Electron.app
yarn start

yarn package
codesign --deep --force --verbose --sign - out/Ollama-darwin-universal/Ollama.app
open out/Ollama-darwin-universal/Ollama.app
```

Credits: https://github.com/ollama/ollama/blob/main/macapp

---

# Desktop

This app builds upon Ollama to provide a desktop experience for running models.

## Developing

First, build the `ollama` binary:

```
cd ..
go build .
```

Then run the desktop app with `npm start`:

```
cd macapp
npm install
npm start
```
