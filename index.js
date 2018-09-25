const dnsd = require("dnsd");
const https = require("https");

const dnsOverHttps = (url, type, httpsIP, httpsPort, callback) => {
    // Send https request
    return https.get('https://' + httpsIP + ":" + httpsPort + 
        '/dns-query?ct=application/dns-json&name=' +
        url + '&type=' + type, (res) => {
            // buffer
            let size = 0;
            let chunks = [];
        
            // buffering
            res.on('data', (data) => {
                size += data.length;
                chunks.push(data);
            });
            res.on('end', () => {
                callback(chunks, size);
            });
        });
}

class DnsOverHttpsServer {
    constructor(remoteIP = "1.1.1.1", remotePort = 443) {
        console.log("remote server:", remoteIP + ":" + remotePort);
        
        // Creat dns server
        this.dnsd = dnsd.createServer( (dnsReq, dnsRes) => {
            console.log(dnsReq.question);
            
            // Send https request
            dnsOverHttps(
                dnsReq.question[0].name,
                dnsReq.question[0].type,
                remoteIP,
                remotePort,
                (chunks, size) => {
                let data = Buffer.concat(chunks, size);
                // parse and send response
                try {                
                    let resJson = JSON.parse(data.toString());
                    let len = resJson.Answer.length;
                    for(let i = 0; i < len; i++) {
                        dnsRes.answer.push({
                            name: resJson.Answer[i].name,
                            type: dns_types[resJson.Answer[i].type],
                            data: resJson.Answer[i].data,
                            'ttl': resJson.Answer[i].TTL
                        });
                    }
                        
                    console.log("ask:", dnsReq.question[0].name);
                    console.log("ans:", dnsRes.answer);
                    dnsRes.end();
                }
                catch(err)
                {
                    console.log(err);
                }            
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });
        });
    }
    
    listen(port, address)
    {
        this.dnsd.listen(port, address);
    }
    
}

// dns type convert
const dns_types =
    { 0: null
    , 1: 'A'
    , 2: 'NS'
    , 3: 'MD'
    , 4: 'MF'
    , 5: 'CNAME'
    , 6: 'SOA'
    , 7: 'MB'
    , 8: 'MG'
    , 9: 'MR'
    , 10: 'NULL'
    , 11: 'WKS'
    , 12: 'PTR'
    , 13: 'HINFO'
    , 14: 'MINFO'
    , 15: 'MX'
    , 16: 'TXT'
    , 17: 'RP'
    , 18: 'AFSDB'
    , 19: 'X25'
    , 20: 'ISDN'
    , 21: 'RT'
    , 22: 'NSAP'
    , 23: 'NSAP-PTR'
    , 24: 'SIG'
    , 25: 'KEY'
    , 26: 'PX'
    , 27: 'GPOS'
    , 28: 'AAAA'
    , 29: 'LOC'
    , 30: 'NXT'
    , 31: 'EID'
    , 32: 'NIMLOC'
    , 33: 'SRV'
    , 34: 'ATMA'
    , 35: 'NAPTR'
    , 36: 'KX'
    , 37: 'CERT'
    , 38: 'A6'
    , 39: 'DNAME'
    , 40: 'SINK'
    , 41: 'OPT'
    , 42: 'APL'
    , 43: 'DS'
    , 44: 'SSHFP'
    , 45: 'IPSECKEY'
    , 46: 'RRSIG'
    , 47: 'NSEC'
    , 48: 'DNSKEY'
    , 49: 'DHCID'
    , 50: 'NSEC3'
    , 51: 'NSEC3PARAM'
    , 52: 'TLSA'
    // 53 - 54 unassigned
    , 55: 'HIP'
    , 56: 'NINFO'
    , 57: 'RKEY'
    , 58: 'TALINK'
    , 59: 'CDS'
    // 60 - 98 unassigned
    , 99: 'SPF'
    , 100: 'UINFO'
    , 101: 'UID'
    , 102: 'GID'
    , 103: 'UNSPEC'
    , 104: 'NID'
    , 105: 'L32'
    , 106: 'L64'
    , 107: 'LP'
    // 108 - 248 unassigned
    , 249: 'TKEY'
    , 250: 'TSIG'
    , 251: 'IXFR'
    , 252: 'AXFR'
    , 253: 'MAILB'
    , 254: 'MAILA'
    , 255: '*'
    , 256: 'URI'
    , 257: 'CAA'
    // 258 - 32767 unassigned
    , 32768: 'TA'
    , 32769: 'DLV'
    // 32770 - 65279 unassigned
    // 65280 - 65534 Private use
    , 65535: 'Reserved'
    };

module.exports = {
    DnsOverHttpsServer
};