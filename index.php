<?php
$apibase = 'http://hermes.net.wurstsalat.cloud';

require __DIR__ . '/vendor/autoload.php';

$starttime = microtime(true);
$items = json_decode(file_get_contents($apibase . '/list'));
$endtime = microtime(true);

$duration = $endtime - $starttime;
header('X-Duration: ' . number_format($duration * 1000, 2, '.', '') . 'ms');

$loader = new Twig_Loader_Filesystem(__DIR__ . '/templates');
$twig = new Twig_Environment($loader, [
    'debug' => false,
    'cache' => __DIR__ . '/cache',
]);

$twigTemplate = $twig->load('index.twig');

$rooms = [];
foreach($items as $item){
    $room = $item->attributes->location;
    if(!array_key_exists($room, $rooms)){
        $rooms[$room] = [
            'items' => [],
            'name' => $room
        ];
    }
    $rooms[$room]['items'][] = $item;
}

echo $twigTemplate->render([
    'rooms' => $rooms,
]);