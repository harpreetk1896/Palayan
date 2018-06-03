    <?php
    function find_value($data) {
    // $input is the word being supplied by the user
    $handle = @fopen("/users/edwin/list.txt", "r");
    if ($handle) {
      while (!feof($handle)) {
        $entry_array = explode(":",fgets($handle));
        if ($entry_array[0] == $input) {
          return $entry_array[1];
          }
        }
      fclose($handle);
      }
    return NULL;
    }
    ?>