# Ingress nginx security test

```sh
$ kubectl port-forward -n ingress-nginx --address=0.0.0.0 svc/ingress-nginx-controller 3000:80
$ curl 10.254.1.51:3000
```

```sh
$ node client.js
$ HOST=ddos-test1.test.dev COUNT=11 node client.js
$ HOST=ddos-test2.test.dev COUNT=11 REQUEST_PATH=/ node client.js
```

```yaml
metadata:
  annotations:
    # 한 개의 IP에서 동시에 연결 가능한 커넥션 수를 제한
    nginx.ingress.kubernetes.io/limit-connections: "10"
    # 클라이언트 IP에서의 초당 요청 건 수 제한
    nginx.ingress.kubernetes.io/limit-rps: "5"
    # 클라이언트 IP에서의 분당 요청 건 수 제한
    nginx.ingress.kubernetes.io/limit-rpm: "5"
    # 초과된 request에 대해 accept 해주는 값 (default:5)
    nginx.ingress.kubernetes.io/limit-burst-multiplier: "5"
    # IP 수준에서 block/allow를 할 수 있는 방화벽 기능
    nginx.ingress.kubernetes.io/whitelist-source-range: 111.111.111.0/24,22.222.222.22/32
```