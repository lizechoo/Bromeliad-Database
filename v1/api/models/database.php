<?php
require_once(__DIR__."/authenticate.php");
require_once(__DIR__."/db-config.php");

if (!isset($routed))
	die();

// $config = array(
//           'driver'    => 'mysql', // Db driver
//           'host'      => '192.168.3.81',
//           'database'  => 'bwg',
//           'username'  => 'bwgadmin',
//           'password'  => 'DV62W6QxU2eDwLNS',
//           'charset'   => 'utf8', // Optional
//           'collation' => 'utf8_unicode_ci'
//       );

try {
    new \Pixie\Connection('mysql', $config, 'QB');
} catch (PDOException $e) {
    Response::error(500, "Unable to connect to database.");
}

$db = QB::pdo();

// Util functions
// group duplicate rows with the same $key, putting all data with
// $fields->$field as an array with key $fields->$key
function groupAsArray ($input, $key, $fields) {
  $results = array();
  foreach ($input as $r) {
		$r = (array) $r;
    $row_key = $r[$key];
    if (!isset($results[$row_key])) {
      $results[$row_key] = $r;
			foreach ($fields as $field => $as) {
	      if (isset($r[$field])) {
	        $results[$row_key][$as] = array($r[$field]);
	      } else {
	        $results[$row_key][$as] = array();
	      }
			}
      unset($results[$row_key][$field]);
    } else {
			foreach ($fields as $field => $as) {
				if (isset($r[$field])) {
	        $results[$row_key][$as][] = $r[$field];
	      }
			}
    }
  }
  return array_values($results);
}

// group duplicate rows with the same $key, putting all data with
// $arrays->$field as an array with key $field->$key and
// objects $key->$value as the key of the row
function groupArraysObjects ($query, $key, $arrays, $arraysOfObject = array(), $objects, $columns = array()) {
	$results = array();
	while ($r = $query->fetch(PDO::FETCH_ASSOC)) {
		$row_key = $r[$key];
		if (!isset($results[$row_key])) {
			$results[$row_key] = $r;

			# arrays
			foreach ($arrays as $field => $as) {
				if (isset($r[$field])) {
					$results[$row_key][$as] = array($r[$field]);
				}
				unset($results[$row_key][$field]);
			}

			# arrays of objects
			foreach ($arraysOfObject as $objectKey => $col) {
				$object = array();
				foreach ($col as $column) {
					if (isset($r[$column])) {
						$object[$column] = $r[$column];
					}
					unset($results[$row_key][$column]);
				}
				if (count($object) > 0) {
					if (!isset($results[$row_key][$objectKey]))
						$results[$row_key][$objectKey] = array();
					$results[$row_key][$objectKey][] = $object;
				}
			}

			# objects
			foreach ($objects as $as => $object) {
				if (isset($r[$object['key']]) && isset($r[$object['value']])) {
					$new_object = new stdClass();
					$new_object->$r[$object['key']] = $r[$object['value']];
					$results[$row_key][$as] = $new_object;
				}
				unset($results[$row_key][$object['key']]);
				unset($results[$row_key][$object['value']]);
			}
			foreach ($columns as $columnName => $fields) {
				$results[$row_key][$columnName] = array();
				foreach ($fields as $field) {
					$value = $results[$row_key][$field];
					$results[$row_key][$columnName][$field] = $value;
					unset($results[$row_key][$field]);
				}
			}
		} else {
			foreach ($arrays as $field => $as) {
				if (isset($r[$field])) {
					if (!isset($results[$row_key][$as]))
						$results[$row_key][$as] = array();
					if (!in_array($r[$field], $results[$row_key][$as]))
						$results[$row_key][$as][] = $r[$field];
				}
			}

			foreach ($arraysOfObject as $objectKey => $col) {
				$object = array();
				foreach ($col as $column) {
					if (isset($r[$column])) {
						$object[$column] = $r[$column];
					}
				}
				if (count($object) > 0) {
					if (!isset($results[$row_key][$objectKey]))
						$results[$row_key][$objectKey] = array();
					if (!in_array($object, $results[$row_key][$objectKey]))
						$results[$row_key][$objectKey][] = $object;
				}
			}

			foreach ($objects as $as => $object) {
				if (isset($r[$object['key']]) && isset($r[$object['value']])) {
					if (!isset($results[$row_key][$as]))
						$results[$row_key][$as] = new stdClass();
					$results[$row_key][$as]->$r[$object['key']] = $r[$object['value']];
				}
			}
		}
	}
	return array_values($results);
}

function is_assoc($arr) {
	if (!is_array($arr)) return false;
  return array_keys($arr) !== range(0, count($arr) - 1);
}

function build_insert_batch($table, $data) {
	if (count($data) == 0) return;
	$columns = implode(",", array_keys($data[0]));
	$rowsArray = array();
	foreach ($data as $row) {
		$rowsData = implode(", ", array_values($row));
		$rowsArray[] = " ($rowsData)";
	}
	$rows = implode(",", $rowsArray);
	return "INSERT INTO $table ($columns) VALUES $rows";
}

function executeRawQuery($query) {
  $pdo = QB::pdo();
  $stmt = $pdo->query($query);
}

?>
