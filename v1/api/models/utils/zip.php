<?php
class ZipException extends Exception {

}
/* creates a compressed zip file */
function create_zip($files = array(),$destination = '',$overwrite = false) {
	//if the zip file already exists and overwrite is false, return false
	if(file_exists($destination) && !$overwrite) {
		throw new ZipException("File exists and overwrite is false");
	}
	//vars
	$valid_files = array();
	//if files were passed in...
	if(is_array($files)) {
		//cycle through each file
		foreach($files as $table => $path) {
			//make sure the file exists
			if(file_exists($path)) {
				$valid_files[$table] = $path;
			}
		}
	}
	//if we have good files...
	if(count($valid_files)) {
		//create the archive
		$zip = new ZipArchive();
		if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
			throw new ZipException("ZipArchive cannot open zip");
		}
		//add the files
		foreach($valid_files as $table => $path) {
			$zip->addFile($path, $table);
		}
		//debug
		//echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

		//close the zip -- done!
		$zip->close();

		//check to make sure the file exists
		return file_exists($destination);
	}
	else
	{
		throw new ZipException("No valid files");
	}
}
?>
