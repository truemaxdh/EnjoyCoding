<?php
$myfile = 'highscores.txt';
$lines = file($myfile);    

function push_scores($ranking, $user_name, $user_score)
{
	global $myfile;
	global $lines;
	for($j=count($lines)-1;$j>=$ranking;$j--)
	{
		$lines[$j]=$lines[$j-1];
	}
	$lines[$ranking-1]=$user_name."<delimiter/>".$user_score."\n";
	file_put_contents($myfile, implode($lines)) or die("fipe_put_contents failed");
}
?>