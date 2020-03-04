<?php
require_once(__DIR__.'/validators/measurements/editValidator.php');

function isDatasetMeasurementExist($datasets, $returnIfFound) {
  foreach ($datasets as $dataset) {
    $dataset_id = $dataset['dataset_id'];
    foreach ($dataset['species'] as $species_id => $measurement) {
      $found = isMeasurementExist($dataset_id, $species_id);
      if (($found && $returnIfFound) || (!$found && !$returnIfFound)) {
        return array($dataset_id, $species_id);
      }
    }
  }
  return false;
}

function isMeasurementExist($dataset_id, $species_id) {
  $query = QB::table('measurements')
    ->select('measurements.measurement_id')
    ->join('dataset_measurements', 'measurements.measurement_id', '=', 'dataset_measurements.measurement_id', 'inner')
    ->where('dataset_measurements.dataset_id', $dataset_id)
    ->join('species', 'species.species_id', '=', 'measurements.species_id', 'inner')
    ->where('species.species_id', $species_id);

  return (count($query->get()) > 0);
}

function checkMeasurement($measurement_id) {
  $query = QB::table('measurements')
    ->select("measurement_id")
    ->where("measurement_id", $measurement_id);

  return (count($query->get()) > 0);
}

function validateMeasurements($measurements) {
  if (!is_array($measurements))
    Response::error(400, "measurements field must be an 'array'");
  foreach ($measurements as $dataset) {
    validateDatasetMeasurement($dataset);
  }
}

function validateUpdateMeasurements($measurements) {
  if (!is_array($measurements) || isset($measurements[0]))
    Response::error(400, "measurements field must be an object");
  foreach ($measurements as $measurement_id => $measurement) {
    if (!checkMeasurement($measurement_id))
      Response::error(400, "measurement (id: $measurement_id) does not exist");

    validateMeasurement($measurement);
  }
}

function validateMeasurement($measurement) {
  if (!is_array($measurement) || isset($measurement[0]))
    Response::error(400, "measurements must be an object of measurement objects");

  if (!isset($measurement['value'])) { // range has an array of value
    if (!isset($measurement['min']))
      Response::error(400, "Range measurement must contain 'min' field");
    if (!is_numeric($measurement['min']))
      Response::error(400, "'min' must be numeric");

    if (!isset($measurement['max']))
      Response::error(400, "Range measurement must contain 'max' field");
    if (!is_numeric($measurement['min']))
      Response::error(400, "'max' must be numeric");

    if (!isset($measurement['unit']))
      Response::error(400, "Range measurement must contain 'unit' field");
    if (!is_string($measurement['unit']))
      Response::error(400, "'unit' must be a string");
  } else {
    if (!is_string($measurement['value']))
      Response::error(400, "Category measurement must be a string");
  }

  if (isset($measurement['biomass']))
    validateBiomass($measurement['biomass']);
}

function validateDatasetMeasurement($dataset) {
  if (!is_assoc($dataset))
    Response::error(400, "measurement must be an object");
  if (!isset($dataset['dataset_id']))
    Response::error(400, "Missing 'dataset_id' field");
  if (!isset($dataset['species']))
    Response::error(400, "Missing 'species' field");
  if (!is_assoc($dataset['species']))
    Response::error(400, "'species' field must be an object");
  if (count($dataset['species']) == 0)
    Response::error(400, "'species' object must have at least one measurement");
  foreach ($dataset['species'] as $species_id => $measurement) {
    if (!is_numeric($species_id))
      Response::error(400, "'species' keys must be numeric species_id");
    if (!is_assoc($measurement))
      Response::error(400, "'species' value must be an object");
    if (count($measurement) != 1)
      Response::error(400, "'species' must contain either categories or ranges");

    if (!isset($measurement['categories']) && !isset($measurement['ranges']))
      Response::error(400, "'measurement' must be either 'categories' or 'ranges'");

    if (isset($measurement['categories'])) {
      $categorical = true;
      $values = $measurement['categories'];
    } else {
      $categorical = false;
      $values = $measurement['ranges'];
    }

    foreach ($values as $value) {
      if (!is_array($value)) {
        if (!$categorical)
          Response::error(400, "Range must be an object with keys 'min' 'max' and 'unit'");
        else if (!is_string($value))
          Response::error(400, "Category value must a string");
      } else {
        if (!is_assoc($value))
          Response::error(400, "Measurement value must be either a string or an object");

        if ($categorical) {
          if (!isset($value['value']))
            Response::error(400, "Category has no 'value'");
        } else {
          if (!isset($value['min']))
            Response::error(400, "Ranges must have a 'min' value");
          if (!isset($value['max']))
            Response::error(400, "Ranges must have a 'max' value");
          if (!isset($value['unit']))
            Response::error(400, "Ranges must have a 'unit' value");
        }
        if (isset($value['biomass'])) {
          validateBiomass($value['biomass']);
        }
      }
    }
  }
}

function validateBiomass($biomass) {
  if (!is_array($biomass) && !is_assoc($biomass))
    Response::error(400, "'biomass' must be an object with keys 'value', 'unit' and 'dry_wet'");
  if (!isset($biomass['value']))
    Response::error(400, "'value' missing from 'biomass' field");
  if (!is_numeric($biomass['value']))
    Response::error(400, "Biomass value must be numeric");
  if (!isset($biomass['unit']))
    Response::error(400, "'unit' missing from 'biomass' field");
  if (strlen($biomass['unit']) > 10)
    Response::error(400, "'unit' field in 'biomass' must not exceed 10 characters");
  if (!isset($biomass['dry_wet']))
    Response::error(400, "'dry_wet' missing from 'biomass' field");
  if ($biomass['dry_wet'] != 'wet' && $biomass['dry_wet'] != 'dry')
    Response::error(400, "'dry_wet' must be either 'wet or 'dry'");
}

function insertMeasurements($datasets, $remove) {
  $errors = array();
  $inserted_datasets = array();

  foreach ($datasets as $dataset) {
    $dataset_id = $dataset['dataset_id'];
    if ($remove)
      removeAllMeasurements($dataset_id);
    foreach ($dataset['species'] as $species_id => $measurement) {

      foreach ($measurement as $type => $values) {
        $category_range = ($type == 'categories' ? 'category':'range');
        foreach ($values as $value) {
          $measurement_id = null;
          try {
            $measurement_id = insertMeasurement($species_id, $category_range, $value);
          } catch (PDOException $e) {
            if ($e->errorInfo[1] == 1452) {
              $message = "Species with species_id: $species_id not found.";
              if (!in_array($message, $errors))
                $errors[] = $message;
            } else
              $errors[] = "PDOException inserting measurements: ".$e->getMessage();
            continue;
          }
          try {
            insertDatasetMeasurement($dataset_id, $measurement_id);

            $inserted_datasets[] = $dataset_id;
          } catch (PDOException $e) {
            if ($e->errorInfo[1] == 1452)
              $errors[] = "Dataset with dataset_id: $dataset_id not found.";
            else
              $errors[] = "PDOException inserting measurements: ".$e->getMessage();
          }
        }
      }
    }
  }
  return array($inserted_datasets, $errors);
}

function insertMeasurement($species_id, $category_range, $value) {
  $insert = array(
    "species_id" => $species_id,
    "category_range" => $category_range
  );

  if ($category_range == 'range') {
    $insert['range_min'] = $value['min'];
    $insert['range_max'] = $value['max'];
    $insert['range_unit'] = $value['unit'];
  } else {
    $insert['category_value'] = $value['value'];
  }

  if (isset($value['biomass'])) {
    $insert['biomass'] = $value['biomass']['value'];
    $insert['dry_wet'] = $value['biomass']['dry_wet'];
    $insert['unit'] = $value['biomass']['unit'];
  }

  $query = QB::table('measurements');
  $measurement_id = $query->insert($insert);
  return $measurement_id;
}

function insertDatasetMeasurement($dataset_id, $measurement_id) {
  $query = QB::table('dataset_measurements');
  $query->insert(array(
    "dataset_id" => $dataset_id,
    "measurement_id" => $measurement_id
  ));
}

function updateMeasurements($measurements) {
  $errors = array();
  $updated = array();

  foreach ($measurements as $measurement_id => $measurement) {
    try {
      $query = QB::table('measurements')->where('measurement_id', $measurement_id);
      $update = array();

      if (!isset($measurement['value'])) {
        $update = array(
          'range_min' => $measurement['min'],
          'range_max' => $measurement['max'],
          'range_unit' => $measurement['unit']
        );
      } else {
        $update = array(
          'category_value' => $measurement['value']
        );
      }

      if (isset($measurement['biomass'])) {
        $update['biomass'] = $measurement['biomass']['value'];
        $update['unit'] = $measurement['biomass']['unit'];
        $update['dry_wet'] = $measurement['biomass']['dry_wet'];
      } else {
        $update['biomass'] = null;
        $update['unit'] = 'mg';
        $update['dry_wet'] = 'dry';
      }

      $query->update($update);

      $updated[] = $measurement_id;
    } catch (PDOException $e) {
      $errors[$measurement_id] = "PDOException updating measurement: ".$e->getMessage;
    }
  }
  return array($updated, $errors);
}

function removeAllMeasurements($dataset_id) {
  $query = "DELETE FROM measurements
    WHERE measurement_id IN
    (SELECT measurement_id FROM dataset_measurements
      WHERE dataset_id = ?)";

  QB::query($query, array($dataset_id));
}

function removeMeasurements($species_id, $dataset_id) {
  $query = "DELETE FROM measurements
    WHERE species_id = ?
    AND measurement_id IN
    (SELECT measurement_id FROM dataset_measurements
      WHERE dataset_id = ?)";

  QB::query($query, array($species_id, $dataset_id));
}

function measurementDatasetMap($measurement_ids) {
  $query = QB::table('measurements');

  foreach ($measurement_ids as $measurement_id) {
    $query->orWhere('measurements.measurement_id', $measurement_id);
  }

  $query->join('dataset_measurements', 'dataset_measurements.measurement_id', '=', 'measurements.measurement_id', 'left');
  $query->select('dataset_measurements.dataset_id');

  $query->join('datasets', 'dataset_measurements.dataset_id', '=', 'datasets.dataset_id', 'left');
  $query->select('datasets.name');

  $map = array();
  foreach ($query->get() as $measurement) {
    $map[$measurement->dataset_id] = $measurement->name;
  }

  return $map;
}

?>
