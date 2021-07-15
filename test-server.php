<?php
header('Access-Control-Allow-Origin: *');

$contenttypes = [
    'cjs' => 'application/javascript',
    'css' => 'text/css',
    'html' => 'text/html',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'mjs' => 'application/javascript',
];

if (substr($_SERVER['REQUEST_URI'], -1, 1) === '/') {
    $_SERVER['REQUEST_URI'] .= 'index.html';
}

file_put_contents('php://stderr', $_SERVER['REQUEST_METHOD'] . ' ' . $_SERVER['REQUEST_URI'] . PHP_EOL);

if (file_exists(__DIR__ . '/dist' . $_SERVER['REQUEST_URI'])) {
    $pathinfo = pathinfo(__DIR__ . '/dist' . $_SERVER['REQUEST_URI']);

    header('Service-Worker-Allowed: /');

    if(array_key_exists($pathinfo['extension'], $contenttypes)){
        header('Content-Type: ' . $contenttypes[$pathinfo['extension']] . '; charset=utf-8');
    }

    readfile(__DIR__ . '/dist' . $_SERVER['REQUEST_URI']);
} else {
    header('Not Found', true, 404);
    echo 'Not found';
}
