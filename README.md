# 시작하기

위 프로젝트는 esbuild-loader 를 적용한 CRA 템플릿 입니다.

[데모 바로가기](https://wdjty326.github.io/gif-duration/)

## 사용가능한 명령어

위 프로젝트는 아래에 정의된 명령어를 사용하실 수 있습니다.

### `yarn start`

개발자 모드로 웹을 실행시킵니다.\
[http://localhost:3000](http://localhost:3000) 주소를 브라우저에 입력하여 화면을 볼 수 있습니다.

코드가 변경될때 마다 페이지가 새로고침 됩니다.\
코드규칙 에러를 콘솔로 보여줍니다.

### `yarn build`

`build` 디렉토리에 프로젝트를 배포용으로 빌드합니다. \
배포 모드에서 소스코드를 올바르게 번들하고 최상의 성능을 위해 빌드를 최적화합니다.

빌드된 내용은 `craco.config.js` 설정에 따라 파일이름에 해시정보가 추가될 수 있습니다.

자세한 내용은 Create React App의 [배포](https://facebook.github.io/create-react-app/docs/deployment) 섹션을 확인하세요.

### `yarn test`

테스터를 watch 모드로 활성화 합니다.\
자세한 내용은 Create React App의 [테스트](https://facebook.github.io/create-react-app/docs/running-tests) 섹션을 확인하세요.

### `yarn eject`

**경고: 이 명령어는 한번만 실행이 가능합니다. 실행 후 되돌아 갈 수 없으니 주의해주세요!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

위 프로젝트는 `@craco/craco` 를 사용하여 오버라이딩이 가능하므로 `yarn eject` 를 사용하실 필요가 없습니다.

[craco](https://github.com/gsoft-inc/craco) 링크에서 자세한 설정 방법을 확인해주세요.

## 더 알아보기

추가로 확인하고 싶은 내용이 있다면 [Create React App](https://facebook.github.io/create-react-app/docs/getting-started) 링크를 클릭하세요.

## 참조

[pradel/create-react-app-esbuild](https://github.com/pradel/create-react-app-esbuild)
