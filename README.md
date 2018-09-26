# dns-over-https-server
A proxy server which convert DNS protocal to DNS over HTTPS

Demo:
```js
// index.js
const dnsOverHttpsServer = require("dns-over-https-server");

let server = new dnsOverHttpsServer.DnsOverHttpsServer;
server.listen(53, "127.0.0.1");// confirm right if use port 53, like sudo in linux.
```

Test(listen):
```
$ sudo node index.js
remote server: 1.1.1.1:443
[ DNSRecord { name: 'google.com', type: 'A', class: 'IN' } ]
ask: google.com
ans: [ { name: 'google.com.', type: 'A', data: '172.217.6.78', ttl: 140 } ]
```

Test(DNS request):
```
$ dig google.com @127.0.0.1

; <<>> DiG 9.9.4-RedHat-9.9.4-61.el7 <<>> google.com @127.0.0.1
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 22316
;; flags: qr rd ad; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;google.com.                    IN      A

;; ANSWER SECTION:
google.com.             3600    IN      A       172.217.6.46

;; Query time: 705 msec
;; SERVER: 127.0.0.1#53(127.0.0.1)
;; WHEN: Tue Sep 25 17:14:28 CST 2018
;; MSG SIZE  rcvd: 44
```