<?php
    include('connection.php');
    include('index.html');
    
    if(isset($_POST['submit'])){

        $name = $_POST["name"];
        $email = $_POST["email"];
        $password = $_POST["password"];
        $phone = $_POST["phone"];
    
        $hash = password_hash($password, PASSWORD_DEFAULT);

        // for storing files
        $file = $_FILES["file"]["name"];
        $tmpfile = $_FILES["file"]['tmp_name'];
        $folder = "images/" . $file;


        if(!empty($name) && !empty($email) && !empty($password) && !empty($phone) && !empty($file)){
            $query = "INSERT INTO users(name, email, password, phone, file) VALUES('$name', '$email', '$hash', '$phone', '$file')";
            
            mysqli_query($_conn, $query);
            move_uploaded_file($tmpfile, $folder);

            echo "
            <script>
                alert('Your response is recorded');
            </script>
            ";
            
            mysqli_close($_conn);
        }
        else{
            echo "All fields are required";
        }
    }
?>