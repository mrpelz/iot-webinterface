<?php
header('Access-Control-Allow-Origin: *');

$contenttypes = [
    'json' => 'application/json',
    'js' => 'application/javascript',
    'html' => 'text/html',
    'css' => 'text/css',
];

if(substr($_SERVER['REQUEST_URI'], -1, 1) === '/'){
    $_SERVER['REQUEST_URI'] .= 'index.html';
}

if(file_exists(__DIR__ . $_SERVER['REQUEST_URI'])){
    $pathinfo = pathinfo(__DIR__ . $_SERVER['REQUEST_URI']);
    if(array_key_exists($pathinfo['extension'], $contenttypes)){
        header('Content-Type: ' . $contenttypes[$pathinfo['extension']]);
    }
    readfile(__DIR__ . $_SERVER['REQUEST_URI']);
}else{
    header('Not Found', true, 404);
    echo 'Not found';
}