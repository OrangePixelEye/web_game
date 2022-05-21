<?php


$dir = 'sprites/';
$diretorio = dir($dir);
$files = glob($dir);

  

while($arquivo = $diretorio -> read()){
    $arquivoLocal = $dir.$arquivo;
}

?>