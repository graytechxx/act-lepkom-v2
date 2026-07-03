<?php
echo "PDO drivers: " . implode(', ', PDO::getAvailableDrivers()) . "\n";
echo "SQLite3 class: " . (class_exists('SQLite3') ? 'YES' : 'NO') . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Loaded extensions: " . implode(', ', get_loaded_extensions()) . "\n";
