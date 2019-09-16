const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
import { getCommandValue } from './utils'

// 代理配置
const proxyConfig = {
    module: getCommandValue('module'),
    env: getCommandValue('env'),
    local: `http://127.0.0.1:${getCommandValue('port') || 8080}`
};

const watchRouters = ['/flight', '/train', '/hotel', '/car', '/expense', '/vcommon'];

const watchEnv = {
    dev: 'https://192.168.1.230',
    test: 'https://192.168.1.221',
    uat: 'https://192.168.1.225',
    proc: 'https://47.101.18.45'
};

function isVisitLocal (url: string) {
    return proxyConfig.module && url.startsWith('/' + proxyConfig.module);
}

// first
httpProxy.createServer({
    ws: true,
    ssl: {
        key: fs.readFileSync('src/cert/m.z-trip.cn.key', 'utf8'),
        cert: fs.readFileSync('src/cert/m.z-trip.cn.pem', 'utf8')
    },
    target: 'http://127.0.0.1:80'
}).listen(443);

const proxyServer = httpProxy.createProxyServer();
const server80 = http.createServer(function (req, res) {
    const visitLocal = isVisitLocal(req.url);
    proxyServer.web(req, res, {
        target: visitLocal ? proxyConfig.local : watchEnv[proxyConfig.env]
    });
}).listen(80);

server80.on('error', function (error, req, res) {
    console.log('proxy error', error);
    res.end(JSON.stringify({code: '500'}));
});

console.log('server is running at 443,current env is ', proxyConfig.env);
