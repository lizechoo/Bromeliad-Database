<?php
require_once(__DIR__."./../../models/utils/zip.php");

use Goodby\CSV\Export\Standard\Exporter;
use Goodby\CSV\Export\Standard\ExporterConfig;
use Goodby\CSV\Export\Standard\CsvFileObject;
use Goodby\CSV\Export\Standard\Collection\PdoCollection;

$pdo = QB::pdo();
$rand = uniqid();

$tablesToSave = array("abundances", "bromeliads", "bromeliads_attr",
"bromeliads_detritus", "dataset_measurements", "datasets", "files", "logs",
"logs_bromeliads", "logs_comments", "logs_datasets", "logs_files", "logs_matrix",
"logs_measurements", "logs_species", "logs_visits", "markdowns", "measurements",
"species", "species_names", "species_tachet", "species_traits", "tachet_traits", "visits");

$files = array();

foreach ($tablesToSave as $table) {
  try {
    $savedPath = saveTableToFile($table, $pdo, $rand);
    $files["$table.csv"] = $savedPath;
  } catch (PDOException $e) {
    Response::error(500, "There was a problem exporting table $table: ".$e->getMessage());
  }
}
$datetime = new DateTime();

$backupPath = $datetime->format("Y-m-d\TH-i-s")."_$rand";

$zip_path = __DIR__."/../../backups/".$backupPath.".zip";
try {
  create_zip($files, $zip_path);
} catch (ZipException $e) {
  Response::error(500, "There was a problem ZIP-ing files: ".$e->getMessage());
}

// remove the temp files
foreach ($files as $file)
  unlink($file);

Response::success(array(
  "backup" => array(
    "path" => $backupPath.".zip"
  )
));

function saveTableToFile($tableName, $pdo, $rand) {
  $config = new ExporterConfig();
  $exporter = new Exporter($config);

  $stmt = $pdo->prepare("SELECT * FROM $tableName");
  $stmt->execute();

  $pdoCollection = new PdoCollection($stmt);
  $filePath = __DIR__."/../../temp/".$tableName."_$rand.csv";
  $exporter->export($filePath, $pdoCollection);
  return $filePath;
}
?>
