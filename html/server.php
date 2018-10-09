<?php
header('Access-Control-Allow-Origin: *');

$contenttypes = [
    'json' => 'application/json',
    'js' => 'application/javascript',
    'html' => 'text/html',
    'css' => 'text/css',
];

if(
    $_SERVER['REQUEST_URI'] === '/list' ||
    $_SERVER['REQUEST_URI'] === '/list?values=1' ||
    $_SERVER['REQUEST_URI'] === '/list?values=0' ||
    $_SERVER['REQUEST_URI'] === '/set'
){
    header('Content-Type: application/json');
    echo file_get_contents('http://hermes.net.wurstsalat.cloud' . $_SERVER['REQUEST_URI']);
    die();
}

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

