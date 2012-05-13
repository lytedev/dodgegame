<?php 

function ipv($key) { return isset($_POST[$key]); }
function pv($key) { if (ipv($key)) { return $_POST[$key]; } return false; }

function isv($key) { return isset($_SESSION[$key]); }
function sv($key) { if (isv($key)) { return $_SESSION[$key]; } return false; }

function igv($key) { return isset($_GET[$key]); }
function gv($key) { if (igv($key)) { return $_GET[$key]; } return false; }

function getHighscores($maxEntries = 5, $file = "highscores.txt") {
	$hsdata = "";
	$handle = fopen($file, 'r');
	while (!feof($handle)) {
	   $hsdata .= fgets($handle);
	}
	fclose($handle);

	$lines = explode("\n", $hsdata);
	$hs = array();

	for ($i = 0; $i < count($lines); $i++) {
		$keyval = explode(":", $lines[$i]);
		$hs[$i][0] = trim($keyval[0]);
		$hs[$i][1] = intval(trim($keyval[1]));
	}

	$hsc = count($hs);
	for ($i = 0; $i < $maxEntries - $hsc; $i++) {
		$id = $hsc + $i;
		$hs[$id][0] = "N/A";
		$hs[$id][1] = 0;
	}

	return $hs;
}

function printHighscores($data = false, $maxEntries = 5, $file = "highscores.txt") {

	if ($data === false) { $data = getHighscores(); }
	$max = count($data);
	if ($maxEntries < $max) { $max = $maxEntries; }
	for ($i = 0; $i < $max; $i++) {
		echo ($i + 1) . ". "; ?><strong><?php echo $data[$i][0]; ?></strong>: <em><?php echo $data[$i][1]; ?></em></p><?php 
	}
	
}

function saveHighscores($data, $maxEntries = 5, $file = "highscores.txt") {
	$max = count($data);
	if ($maxEntries < $max) { $max = $maxEntries; }

	$handle = fopen($file, 'w');
	for ($i = 0; $i < $max; $i++) {
		$str = $data[$i][0] . ": " . $data[$i][1] . "\n";
		fwrite($handle, $str);
	}
	fclose($handle);
}

$hs = getHighscores();

$scoredata = pv("score");
if ($scoredata === false || $scoredata === 0) { $scoredata = gv("score"); }

$name = pv("name");
if ($name === false || $name === 0) { $name = gv("name"); }

if ($scoredata !== false && $scoredata !== 0) {	
	$scoredata2 = explode(" ", $scoredata);
	$scorehash = trim($scoredata2[0]);
	$score = intval(trim($scoredata2[1]));
	$happening = "secret)_I0gR:Lg[p-353" . $score;
	$phphash = md5($happening);

	if ($scorehash != $phphash) { 
		exit;
	}

	for ($i = 0; $i < count($hs); $i++) {
		if ($score > $hs[$i][1]) {
			$displayName = htmlentities($name);
			if ($displayName === false) {
				$displayName = "YOU";
			}
			if (strlen($displayName) > 16) {
				$displayName = substr($displayName, 0, 16);
			}
			$newhsentry = array($displayName, $score);
			array_splice(&$hs, $i, 0, array($newhsentry));

			if ($name === false) {
				require("header.php"); 

				?> 

				<p>A new high score!</p>

				<?php printHighscores($hs); ?>

				<form action="" method="post">
					<p>Something to remember you by:</p>
					<input type="text" name="name" maxlength="16" value="Unknown" onload="this.focus();this.select();" />
					<input type="hidden" name="score" value="<?php echo $scoredata; ?>" />
					<input class="btn primary" type="submit" />
				</form>

				<?php 

				require("footer.php");

				exit;
			} else {
				saveHighscores($hs);
				require("header.php"); 
				echo "<p>Congratulations!</p>";
				printHighscores($hs); 
				require("footer.php");
				exit;
			}
		}
	}
} else {
	require("header.php"); 
	printHighscores();
	require("footer.php");
}