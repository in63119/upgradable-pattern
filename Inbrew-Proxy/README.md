# Inbrew Proxy:

- 구조: 업그레이더블 프록시 컨트랙트를 커스터마이징하여 Proxy 컨트랙트에서 어드민 관리까지 할 수 있도록 만듦

<br/>

# Test

### Deploy Proxy & V1 Contract

- `$ yarn deploy'

### delegateCall Proxy to V1

- `$ yarn test1'

### Upgrade V2 Contract

- `$ yarn upgrade:test'

### delegateCall Proxy to V2 & Proxy admin transfer

- `$ yarn test2'
