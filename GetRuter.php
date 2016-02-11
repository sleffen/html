<?php
$path=$_SERVER["PATH_INFO"];
$uri = "http://reisapi.ruter.no" . $path;
$result = file_get_contents($uri); //StopVisit/GetDepartures/3010524?json=true)
echo $result;