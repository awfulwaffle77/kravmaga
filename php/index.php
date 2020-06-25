<?php
include 'vars.php';
include 'connection.php';
$conn = mysqli_connect($dbServername, $dbAdmin, $dbPassword, $dbName);
$index_events=mysqli_query($conn,"SELECT * FROM evenimente"); 

$data = array();
while($row = mysqli_fetch_assoc($index_events))
{
    $data[]=$row;
}
echo json_encode($data);
?>